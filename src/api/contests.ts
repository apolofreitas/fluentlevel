import { firebase, FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { db, ContestModel } from './db'
import { getCurrentUserDoc, getUserById, User } from './users'
import { getTaskById, Task } from './tasks'

export interface Contest extends Omit<ContestModel, 'participatingUsers'> {
  id: string
  author: User
  task: Task
  participatingUsers: User[]
}

export async function getContestData(contestDoc: FirebaseFirestoreTypes.DocumentReference<ContestModel>) {
  const contestSnap = await contestDoc.get()
  const contestData = await contestSnap.data()

  if (!contestData) throw 'Contest not found'

  const [{ user: author }, task, participatingUsers] = await Promise.all([
    getUserById(contestData.authorId),
    getTaskById(contestData.taskId),
    await Promise.all(contestData.participatingUsers.map(async (id) => (await getUserById(id)).user)),
  ])

  if (!author) throw 'Contest author not found'

  const contest: Contest = {
    ...contestData,
    id: contestSnap.id,
    author,
    task,
    participatingUsers,
  }

  return contest
}

export async function getContests() {
  const currentUser = getCurrentUserDoc()

  if (!currentUser) return []

  const contestsSnap = await db.contests.where('isDeleted', '!=', true).get()
  const contestsDocs = contestsSnap.docs
  const contests = await Promise.all(contestsDocs.map((doc) => getContestData(db.contests.doc(doc.id)))).catch()

  return contests
}

export type CreateContestOptions = Omit<ContestModel, 'authorId' | 'isDeleted' | 'participatingUsers'>

export async function createContest({
  title,
  description,
  password,
  startDate,
  endDate,
  taskId,
}: CreateContestOptions) {
  const currentUserDoc = getCurrentUserDoc()

  if (!currentUserDoc) return null

  const createdContest = await db.contests.add({
    title,
    authorId: currentUserDoc.id,
    isDeleted: false,
    description,
    password,
    startDate,
    endDate,
    taskId,
    participatingUsers: [],
  })
  currentUserDoc.update({
    createdContests: firebase.firestore.FieldValue.arrayUnion(createdContest.id),
  })

  return createdContest
}

export type UpdateContestOptions = Partial<Omit<ContestModel, 'authorId'>>

export async function updateContest(id: string, options: UpdateContestOptions) {
  await db.contests.doc(id).update({
    title: options.title,
    description: options.description,
    password: options.password,
    startDate: options.startDate,
    endDate: options.endDate,
    taskId: options.taskId,
  })
}

export async function deleteContest(id: string) {
  const currentUserDoc = getCurrentUserDoc()

  if (!currentUserDoc) return null

  await db.contests.doc(id).update({
    isDeleted: true,
  })
  currentUserDoc.update({
    createdContests: firebase.firestore.FieldValue.arrayRemove(id),
  })
}
