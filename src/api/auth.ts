import auth from '@react-native-firebase/auth'
import { GoogleSignin as GoogleSignIn } from '@react-native-google-signin/google-signin'
import { users } from '~/services/db'
import { getUserDocByUsername, isUsernameAvailable } from './users'

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
  if (!(await isUsernameAvailable(username))) {
    throw { code: 'auth/username-already-in-use' }
  }

  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user: { uid } }) =>
      users.doc(uid).set({
        username,
        nickname,
        email,
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

      const userDoc = await getUserDocByUsername(usernameOrEmail)

      if (!userDoc) throw error

      const userSnap = await userDoc.get()
      const userData = userSnap.data()

      if (!userData) throw error

      await auth().signInWithEmailAndPassword(userData.email, password)
    })
}

export async function signOut() {
  await auth().signOut()
}

interface ResetPassword {
  email: string
}
export async function resetPassword({ email }: ResetPassword) {
  await auth().sendPasswordResetEmail(email)
}
