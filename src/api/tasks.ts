import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { db, TaskModel } from './db'
import { getCurrentUserDoc, getUserById, User } from './users'

export interface Task extends TaskModel {
  id: string
  author: User
}

export async function getTaskData(taskSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot<TaskModel>) {
  const taskData = taskSnap.data()
  const { user: author } = await getUserById(taskData.authorId)

  if (!author) throw 'Task author not found'

  const task: Task = {
    ...taskData,
    id: taskSnap.id,
    author,
  }

  return task
}

export async function getCommunityTasks() {
  const currentUser = await getCurrentUserDoc()

  if (!currentUser) return []

  const tasksSnap = await db.tasks.where('authorId', '!=', currentUser.id).where('isPublic', '==', true).get()
  const tasksDocs = tasksSnap.docs
  const tasks = await Promise.all(tasksDocs.map(getTaskData)).catch()

  return tasks
}

export async function getCreatedTasks() {
  const currentUser = await getCurrentUserDoc()

  if (!currentUser) return []

  const tasksSnap = await db.tasks.where('authorId', '==', currentUser.id).get()
  const tasksDocs = tasksSnap.docs
  const tasks = await Promise.all(tasksDocs.map(getTaskData)).catch()

  return tasks
}

export type CreateTaskOptions = Omit<TaskModel, 'authorId'>

export async function createTask({ title, description, isPublic, questions }: CreateTaskOptions) {
  const currentUserDoc = await getCurrentUserDoc()

  if (!currentUserDoc) return null

  const createdTask = await db.tasks.add({
    title,
    authorId: currentUserDoc.id,
    description,
    isPublic,
    questions,
  })

  return createdTask
}

export type UpdateTaskOptions = Omit<TaskModel, 'authorId'>

export async function updateTask(id: string, { title, description, isPublic, questions }: UpdateTaskOptions) {
  const updatedTask = await db.tasks.doc(id).update({
    title,
    description,
    isPublic,
    questions,
  })

  return updatedTask
}

export async function deleteTask(id: string) {
  await db.tasks.doc(id).delete()
}
