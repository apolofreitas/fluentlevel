import { extendTheme } from 'native-base'

export const { components }: Parameters<typeof extendTheme>[0] = {
  components: {
    Text: {
      baseStyle: {
        color: 'primary.900',
      },
    },
    Button: {
      baseStyle: {
        height: '48px',
        borderRadius: '16px',
      },
      variants: {
        outline: ({ colorScheme }) => ({
          borderColor: `${colorScheme}.500`,
          borderWidth: '2px',
        }),
      },
    },
    Input: {
      baseStyle: {
        fontFamily: 'NunitoRegular',
        color: 'primary.900',
        placeholderTextColor: 'gray.300',
        height: '48px',
        backgroundColor: 'gray.50',
        borderRadius: '16px',
        _focus: {
          borderWidth: 2,
        },
      },
    },
  },
}
