import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { db, ContestModel } from './db'
import { getCurrentUserDoc, getUserById, User } from './users'

export interface Contest extends ContestModel {
  id: string
  author: User
}

export async function getContestData(contestDoc: FirebaseFirestoreTypes.DocumentReference<ContestModel>) {
  const contestSnap = await contestDoc.get()
  const contestData = await contestSnap.data()

  if (!contestData) throw 'Contest not found'

  const { user: author } = await getUserById(contestData.authorId)

  if (!author) throw 'Contest author not found'

  const contest: Contest = {
    ...contestData,
    id: contestSnap.id,
    author,
  }

  return contest
}

export async function getContests() {
  const currentUser = getCurrentUserDoc()

  if (!currentUser) return []

  const contestsSnap = await db.contests.get()
  const contestsDocs = contestsSnap.docs
  const contests = await Promise.all(contestsDocs.map((doc) => getContestData(db.contests.doc(doc.id)))).catch()

  return contests
}

export type CreateContestOptions = Omit<ContestModel, 'authorId'>

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
    description,
    password,
    startDate,
    endDate,
    taskId,
  })

  return createdContest
}

export type UpdateContestOptions = Omit<ContestModel, 'authorId'>

export async function updateContest(
  id: string,
  { title, description, password, startDate, endDate, taskId }: UpdateContestOptions,
) {
  const updatedContest = await db.contests.doc(id).update({
    title,
    description,
    password,
    startDate,
    endDate,
    taskId,
  })

  return updatedContest
}

export async function deleteContest(id: string) {
  await db.contests.doc(id).delete()
}
