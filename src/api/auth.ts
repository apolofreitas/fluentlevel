import auth from '@react-native-firebase/auth'
import { GoogleSignin as GoogleSignIn } from '@react-native-google-signin/google-signin'

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
export async function signUp({ email, password }: SignUpOptions) {
  await auth().createUserWithEmailAndPassword(email, password)
}

interface SignInWithEmailAndPasswordOptions {
  email: string
  password: string
}
export async function signIn({ email, password }: SignInWithEmailAndPasswordOptions) {
  await auth().signInWithEmailAndPassword(email, password)
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
