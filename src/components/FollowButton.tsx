import React, { useEffect, useRef, useState } from 'react'
import { Button, IButtonProps } from 'native-base'

import { getUserByUsername, toggleFollow, User, UserModel } from '~/api'
import { useCurrentUser } from '~/hooks'

interface FollowButtonProps extends IButtonProps {
  user: UserModel | User
}

export const FollowButton: React.FC<FollowButtonProps> = ({ user, ...rest }) => {
  const buttonRef = useRef(null)
  const { currentUser } = useCurrentUser()
  const [isFollowing, setIsFollowing] = useState(
    currentUser.following.some(({ username }) => username === user.username),
  )
  const [isPendingFollow, setIsPendingFollow] = useState(false)

  useEffect(() => {
    setIsFollowing(currentUser.following.some(({ username }) => username === user.username))
  }, [currentUser, user])

  return (
    <Button
      ref={buttonRef}
      borderRadius="12px"
      padding={3}
      isLoading={isPendingFollow}
      onPress={async () => {
        try {
          setIsPendingFollow(true)

          const { userDoc } = await getUserByUsername(user.username)
          await toggleFollow(userDoc.id)

          if (buttonRef.current) setIsFollowing(!isFollowing)
        } finally {
          if (buttonRef.current) setIsPendingFollow(false)
        }
      }}
      {...rest}
    >
      {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
    </Button>
  )
}
