import auth from '@react-native-firebase/auth'
import { GoogleSignin as GoogleSignIn } from '@react-native-google-signin/google-signin'
import { db } from './db'
import { getUserByUsername, checkUsernameAvailability } from './users'

GoogleSignIn.configure({
  webClientId: '692321367548-7c1qlmekmna8i6h4pp45cu5hgr0r0f45.apps.googleusercontent.com',
})

export async function signInWithGoogle() {
  const { idToken } = await GoogleSignIn.signIn()
  const googleCredential = auth.GoogleAuthProvider.credential(idToken)
  await auth().signInWithCredential(googleCredential)
}

interface SignUpOptions {
  nickname: string
  username: string
  email: string
  password: string
}
export async function signUp({ email, password, nickname, username }: SignUpOptions) {
  const isUsernameAvailable = await checkUsernameAvailability(username)
  if (!isUsernameAvailable) {
    throw { code: 'auth/username-already-in-use' }
  }

  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user: { uid } }) =>
      db.users.doc(uid).set({
        username,
        nickname,
        email,
        bio: '',
        following: [],
        followers: [],

        tasksScore: 0,
        tasksHistory: [],
        createdTasks: [],

        contestsScore: 0,
        contestsHistory: [],
        createdContests: [],
      }),
    )
}

interface SignInWithEmailAndPasswordOptions {
  usernameOrEmail: string
  password: string
}
export async function signIn({ usernameOrEmail, password }: SignInWithEmailAndPasswordOptions) {
  await auth()
    .signInWithEmailAndPassword(usernameOrEmail, password)
    .catch(async (error) => {
      if (error.code !== 'auth/invalid-email') throw error

      const { user } = await getUserByUsername(usernameOrEmail)

      await auth().signInWithEmailAndPassword(user.email, password)
    })
}

export async function signOut() {
  await auth().signOut()
}

interface ResetPasswordOptions {
  email: string
}
export async function resetPassword({ email }: ResetPasswordOptions) {
  await auth().sendPasswordResetEmail(email)
}

interface EditEmailOptions {
  newEmail: string
  actualPassword: string
}
export async function changeEmail({ newEmail, actualPassword }: EditEmailOptions) {
  try {
    const { currentUser } = auth()

    if (!currentUser || !currentUser.email) return

    const credential = auth.EmailAuthProvider.credential(currentUser.email, actualPassword)

    await currentUser.reauthenticateWithCredential(credential)

    await currentUser.updateEmail(newEmail)
  } catch (e) {
    throw e
  }
}

interface EditPasswordOptions {
  actualPassword: string
  newPassword: string
}
export async function changePassword({ actualPassword, newPassword }: EditPasswordOptions) {
  try {
    const { currentUser } = auth()

    if (!currentUser || !currentUser.email) return

    const credential = auth.EmailAuthProvider.credential(currentUser.email, actualPassword)

    await currentUser.reauthenticateWithCredential(credential)

    await currentUser.updatePassword(newPassword)
  } catch (e) {
    throw e
  }
}
