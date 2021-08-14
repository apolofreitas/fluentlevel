import { useToast } from 'native-base'

export function showSimpleToast(toast: ReturnType<typeof useToast>, message: string) {
  if (!toast.isActive(message)) {
    toast.show({
      id: message,
      description: message,
    })
  }
}
