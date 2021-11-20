import React, { useEffect, useState } from 'react'
import { ListRenderItemInfo, TouchableWithoutFeedback } from 'react-native'
import { Box, Icon, Input, FlatList, Button, Text, Image } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { RootScreen } from '~/types/navigation'
import { Picture, searchImages } from '~/utils/searchImages'

export const SelectImageScreen: RootScreen<'SelectImage'> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [images, setImages] = useState<Picture[]>([])

  useEffect(() => {
    setSelectedItemId(null)

    if (search === '') return setIsLoading(true)

    searchImages(search)
      .then(({ photos }) => {
        setImages(
          photos.map(({ src }, index) => ({
            src: src,
            id: index,
          })),
        )
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false))
  }, [search])

  const onSelectImage = () => {
    if (selectedItemId === null) return
    navigation.navigate(route.params.screenToNavigateOnSave, {
      imageUriToSave: images[selectedItemId].src.large,
    })
  }

  return (
    <>
      <Box alignItems="center">
        <Input
          size="sm"
          height={10}
          placeholder="Pesquisar"
          value={search}
          onChangeText={setSearch}
          InputLeftElement={<Icon as={Feather} name="search" size="sm" color="primary.500" margin={3} />}
          marginBottom={4}
          marginX={4}
        />

        {isLoading ? (
          <Text color="primary.700" fontWeight="400" fontSize="sm">
            Digite algo para começar a busca.
          </Text>
        ) : (
          <FlatList
            horizontal={false}
            width="100%"
            numColumns={3}
            data={images}
            extraData={selectedItemId}
            renderItem={({ item: picture }: ListRenderItemInfo<Picture>) => (
              <TouchableWithoutFeedback
                onPress={() => setSelectedItemId(picture.id !== selectedItemId ? picture.id : null)}
              >
                <Image
                  key={picture.id}
                  margin={1}
                  width="24"
                  height="24"
                  borderRadius="16px"
                  borderWidth={3}
                  borderColor={selectedItemId === picture.id ? 'primary.500' : 'transparent'}
                  source={{ uri: picture.src.tiny }}
                  alt="Imagem da internet"
                />
              </TouchableWithoutFeedback>
            )}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 34 * 4 }}
          />
        )}
      </Box>

      <Button
        position="absolute"
        bottom="24px"
        left="32px"
        right="32px"
        isDisabled={selectedItemId === null}
        onPress={onSelectImage}
      >
        Selecionar
      </Button>
    </>
  )
}
