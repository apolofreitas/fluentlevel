import auth from '@react-native-firebase/auth'
import { users } from '~/services/db'

export async function getCurrentUserDoc() {
  const { currentUser } = auth()

  if (!currentUser) return null

  return users.doc(currentUser.uid)
}

export async function getUserDocByUsername(username: string) {
  const userSnaps = await users.where('username', '==', username).limit(1).get()
  const userSnap = userSnaps.docs[0]

  if (!userSnap) return null

  const userDoc = users.doc(userSnap.id)

  return userDoc
}

export async function isUsernameAvailable(username: string) {
  const userDoc = await getUserDocByUsername(username)

  return !userDoc
}

export async function isUserFollowing(id: string) {
  const currentUserDoc = await getCurrentUserDoc()
  const currentUserSnap = await currentUserDoc?.get()
  const currentUserData = currentUserSnap?.data()

  if (!currentUserDoc || !currentUserSnap || !currentUserData) return

  const isFollowing = currentUserData.following.includes(id)

  return isFollowing
}

export async function toggleFollow(id: string) {
  const currentUserDoc = await getCurrentUserDoc()
  const currentUserSnap = await currentUserDoc?.get()
  const currentUserData = currentUserSnap?.data()

  const followedUserDoc = users.doc(id)
  const followedUserSnap = await followedUserDoc?.get()
  const followedUserData = followedUserSnap?.data()

  if (!currentUserDoc || !currentUserSnap || !currentUserData) return
  if (!followedUserDoc || !followedUserSnap || !followedUserData) return

  if (await isUserFollowing(id)) {
    currentUserDoc.update({
      following: currentUserData.following.filter((followingId) => followingId !== id),
    })
    followedUserDoc.update({
      followers: followedUserData.following.filter((followingId) => followingId !== id),
    })
  } else {
    currentUserDoc.update({
      following: [...currentUserData.following, id],
    })
    followedUserDoc.update({
      followers: [...followedUserData.following, id],
    })
  }
}
