import { firebase, FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { db, TaskModel } from './db'
import { getCurrentUserDoc, getUserById, User } from './users'

export interface Task extends TaskModel {
  id: string
  author: User
}

export async function getTaskData(taskDoc: FirebaseFirestoreTypes.DocumentReference<TaskModel>) {
  const taskSnap = await taskDoc.get()
  const taskData = await taskSnap.data()

  if (!taskData) throw 'Task not found'

  const { user: author } = await getUserById(taskData.authorId)

  if (!author) throw 'Task author not found'

  const task: Task = {
    ...taskData,
    id: taskDoc.id,
    author,
  }

  return task
}

export async function getTasks() {
  const currentUser = getCurrentUserDoc()

  if (!currentUser) return []

  const tasksSnap = await db.tasks.where('isDeleted', '!=', true).get()
  const tasksDocs = tasksSnap.docs
  const tasks = await Promise.all(tasksDocs.map((doc) => getTaskData(db.tasks.doc(doc.id)))).catch()

  return tasks
}

export type CreateTaskOptions = Omit<TaskModel, 'authorId' | 'isDeleted'>

export async function createTask({ title, description, isPublic, questions }: CreateTaskOptions) {
  const currentUserDoc = getCurrentUserDoc()

  if (!currentUserDoc) return null

  const createdTask = await db.tasks.add({
    title,
    authorId: currentUserDoc.id,
    isDeleted: false,
    description,
    isPublic,
    questions,
  })
  currentUserDoc.update({
    createdTasks: firebase.firestore.FieldValue.arrayUnion(createdTask.id),
  })

  return createdTask
}

export type UpdateTaskOptions = Partial<Omit<TaskModel, 'authorId' | 'isDeleted'>>

export async function updateTask(id: string, { title, description, isPublic, questions }: UpdateTaskOptions) {
  await db.tasks.doc(id).update({
    title,
    description,
    isPublic,
    questions,
  })
}

export async function deleteTask(id: string) {
  const currentUserDoc = getCurrentUserDoc()

  if (!currentUserDoc) return null

  await db.tasks.doc(id).update({
    isDeleted: true,
  })
  currentUserDoc.update({
    createdTasks: firebase.firestore.FieldValue.arrayRemove(id),
  })
}

export async function getTaskById(id: string) {
  const taskDoc = db.tasks.doc(id)
  return await getTaskData(taskDoc).catch()
}
