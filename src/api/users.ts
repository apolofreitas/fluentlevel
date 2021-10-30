import auth from '@react-native-firebase/auth'
import { firebase, FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { db, UserModel } from './db'

export interface User extends Omit<UserModel, 'followers' | 'following'> {
  id: string
  followers: UserModel[]
  following: UserModel[]
}

export async function getUserData(userDoc: FirebaseFirestoreTypes.DocumentReference<UserModel>) {
  const userSnap = await userDoc.get()
  const userData = userSnap.data()

  if (!userData) throw 'User not found'

  const followers = (
    await Promise.all(
      userData.followers.map(async (targetId) => {
        const userDoc = db.users.doc(targetId)
        const userSnap = await userDoc.get()
        const user = userSnap.data()

        if (!user) return null

        return user
      }),
    )
  ).filter((user) => user !== null) as UserModel[]

  const following = (
    await Promise.all(
      userData.following.map(async (targetId) => {
        const userDoc = db.users.doc(targetId)
        const userSnap = await userDoc.get()
        const user = userSnap.data()

        if (!user) return null

        return user
      }),
    )
  ).filter((user) => user !== null) as UserModel[]

  const user: User = {
    ...userData,
    id: userSnap.id,
    followers,
    following,
  }

  return {
    userDoc,
    userSnap,
    user,
  }
}

export async function getUsers() {
  const usersSnap = await db.users.get()
  const usersDocs = usersSnap.docs
  const users = await Promise.all(usersDocs.map((doc) => doc.data())).catch()

  const currentUserDoc = getCurrentUserDoc()

  if (currentUserDoc !== null) return users.filter((_, index) => usersDocs[index].id !== currentUserDoc.id)

  return users
}

export async function getUserById(id: string) {
  const userDoc = db.users.doc(id)
  return await getUserData(userDoc).catch()
}

export async function getUserByUsername(username: string) {
  const userSnaps = await db.users.where('username', '==', username).limit(1).get()
  const userSnap = userSnaps.docs[0]

  return getUserById(userSnap.id)
}
export async function checkUsernameAvailability(username: string) {
  const userSnaps = await db.users.where('username', '==', username).limit(1).get()
  const userSnap = userSnaps.docs[0]

  return !userSnap
}

export function getCurrentUserDoc() {
  const { currentUser } = auth()

  if (!currentUser) return null

  return db.users.doc(currentUser.uid)
}

type UpdateCurrentUserOptions = Omit<Partial<UserModel>, 'id' | 'email'>

export async function updateCurrentUser(params: UpdateCurrentUserOptions) {
  const currentUserDoc = getCurrentUserDoc()
  if (!currentUserDoc) return
  currentUserDoc.update(params)
}

export async function isCurrentUserFollowing(id: string) {
  const currentUserDoc = getCurrentUserDoc()
  const currentUserSnap = await currentUserDoc?.get()
  const currentUserData = currentUserSnap?.data()

  if (!currentUserDoc || !currentUserSnap || !currentUserData) return

  const isFollowing = currentUserData.following.includes(id)

  return isFollowing
}

export async function toggleFollow(id: string) {
  const currentUserDoc = getCurrentUserDoc()
  const currentUserSnap = await currentUserDoc?.get()
  const currentUser = currentUserSnap?.data()

  const targetUserDoc = db.users.doc(id)
  const targetUserSnap = await targetUserDoc?.get()
  const targetUser = targetUserSnap?.data()

  if (!currentUserDoc || !currentUserSnap || !currentUser) return
  if (!targetUserDoc || !targetUserSnap || !targetUser) return

  if (await isCurrentUserFollowing(id)) {
    await currentUserDoc.update({
      following: firebase.firestore.FieldValue.arrayRemove(id),
    })
    await targetUserDoc.update({
      followers: firebase.firestore.FieldValue.arrayRemove(currentUserDoc.id),
    })
  } else {
    await currentUserDoc.update({
      following: firebase.firestore.FieldValue.arrayUnion(id),
    })
    await targetUserDoc.update({
      followers: firebase.firestore.FieldValue.arrayUnion(currentUserDoc.id),
    })
  }
}
