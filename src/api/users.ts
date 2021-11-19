import auth from '@react-native-firebase/auth'
import { firebase, FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { db, UserModel, TaskModel, TaskResults, ContestModel, ContestResults } from './db'

export interface User extends Omit<UserModel, 'followers' | 'following' | 'tasksHistory' | 'contestsHistory'> {
  id: string
  followers: UserModel[]
  following: UserModel[]
  tasksHistory: Array<
    TaskResults & {
      task: TaskModel
    }
  >
  contestsHistory: Array<
    ContestResults & {
      task: TaskModel
      contest: ContestModel
    }
  >
}

export async function getUserData(userDoc: FirebaseFirestoreTypes.DocumentReference<UserModel>) {
  const userSnap = await userDoc.get()
  const userData = userSnap.data()

  if (!userData) throw 'User not found'

  const followers = await Promise.all(
    userData.followers.map(async (userId) => {
      const userDoc = db.users.doc(userId)
      const userSnap = await userDoc.get()
      const user = userSnap.data()

      if (!user) throw 'User not found'

      return user
    }),
  ).catch(() => [])

  const following = await Promise.all(
    userData.following.map(async (userId) => {
      const userDoc = db.users.doc(userId)
      const userSnap = await userDoc.get()
      const user = userSnap.data()

      if (!user) throw 'User not found'

      return user
    }),
  ).catch(() => [])

  const tasksHistory = await Promise.all(
    userData.tasksHistory.map(async ({ taskId, ...rest }) => {
      const taskDoc = db.tasks.doc(taskId)
      const taskSnap = await taskDoc.get()
      const task = taskSnap.data()

      if (!task) throw 'Task not found'

      return {
        ...rest,
        taskId,
        task,
      }
    }),
  ).catch(() => [])

  const contestsHistory = await Promise.all(
    userData.contestsHistory.map(async ({ contestId, taskId, ...rest }) => {
      const contestDoc = db.contests.doc(contestId)
      const contestSnap = await contestDoc.get()
      const contest = contestSnap.data()

      if (!contest) throw 'Contest not found'

      const taskDoc = db.tasks.doc(taskId)
      const taskSnap = await taskDoc.get()
      const task = taskSnap.data()

      if (!task) throw 'Task not found'

      return {
        ...rest,
        contestId,
        contest,
        taskId,
        task,
      }
    }),
  ).catch(() => [])

  const user: User = {
    ...userData,
    id: userSnap.id,
    followers,
    following,
    tasksHistory,
    contestsHistory,
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

export async function participateInContest(contestId: string) {
  const currentUserDoc = getCurrentUserDoc()

  if (!currentUserDoc) return

  const { user } = await getUserById(currentUserDoc.id)

  if (user.participatingContests.includes(contestId)) return

  await db.contests.doc(contestId).update({
    participatingUsers: firebase.firestore.FieldValue.arrayUnion(user.id),
  })
  await currentUserDoc.update({
    participatingContests: firebase.firestore.FieldValue.arrayUnion(contestId),
  })
}

export async function removeParticipationInContest(contestId: string) {
  const currentUserDoc = getCurrentUserDoc()

  if (!currentUserDoc) return

  const { user } = await getUserById(currentUserDoc.id)

  if (!user.participatingContests.includes(contestId)) return

  await db.contests.doc(contestId).update({
    participatingUsers: firebase.firestore.FieldValue.arrayRemove(user.id),
  })
  await currentUserDoc.update({
    participatingContests: firebase.firestore.FieldValue.arrayRemove(contestId),
  })
}

export interface SubmitScoreOptions {
  contestId?: string
  results: Omit<TaskResults, 'submittedAt'>
}

export async function submitScore({ contestId, results }: SubmitScoreOptions) {
  const currentUserDoc = getCurrentUserDoc()

  if (!currentUserDoc) return

  const { user } = await getUserById(currentUserDoc.id)

  if (!user.tasksHistory.find((history) => history.taskId === results.taskId)) {
    await db.users.doc(currentUserDoc.id).update({
      tasksScore: firebase.firestore.FieldValue.increment(results.totalScore),
      tasksHistory: firebase.firestore.FieldValue.arrayUnion({
        submittedAt: firebase.firestore.Timestamp.now(),
        ...results,
      }),
    })
  }
  if (!!contestId && !user.contestsHistory.find((history) => history.contestId === contestId)) {
    await db.users.doc(currentUserDoc.id).update({
      contestsScore: firebase.firestore.FieldValue.increment(results.totalScore),
      contestsHistory: firebase.firestore.FieldValue.arrayUnion({
        submittedAt: firebase.firestore.Timestamp.now(),
        contestId,
        ...results,
      }),
    })
    await db.contests.doc(contestId).update({
      ranking: firebase.firestore.FieldValue.arrayUnion(user.id),
    })
  }
}
