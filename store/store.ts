import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Store = {
  rootFolder: string
  setRootFolder: (uri: string) => void

  showPickFolder: boolean
  setShowPickFolder: (value: boolean) => void
}

export const useRootFolderStore = create<Store>()(
  persist(
    (set) => ({
      rootFolder: "",
      setRootFolder: (uri: string) => set({ rootFolder: uri }),

      showPickFolder: false,
      setShowPickFolder: (value: boolean) => set({ showPickFolder: value }),
    }),
    {
      name: "root-folder-uri",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)