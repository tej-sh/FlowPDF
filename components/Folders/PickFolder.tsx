import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Image } from 'react-native';
import { useRootFolderStore } from '@/store/store';
import { StorageAccessFramework } from 'expo-file-system/legacy'
import FolderPick from '@/assets/svg/onBoardingSvg';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar'


export function PickFolder() {
  const safeAreaInsets = useSafeAreaInsets()
  const rootFolder = useRootFolderStore((state) => state.rootFolder)
  const setRootFolder = useRootFolderStore((state) => state.setRootFolder)
  const showPickFolder = useRootFolderStore((state) => state.showPickFolder)
  const setShowPickFolder = useRootFolderStore((state) => state.setShowPickFolder)
  const [showErrorBanner, setShowErrorBanner] = useState(false)


  function startPickRootFolder() {
    if (rootFolder !== '') return
    async function pickRootFolder() {
      try {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync()
        if (permissions.granted) {
          setRootFolder(permissions.directoryUri)
          setShowPickFolder(false)
        }
        else {
          setShowErrorBanner(true)
          setTimeout(() => setShowErrorBanner(false), 5000)
        }
      }
      catch (error: any) {
        alert(error)

      }

    }

    pickRootFolder()


  }
  return (
    
    <Modal visible={showPickFolder} transparent={true} >
      {showErrorBanner && (
        <View style={[styles.errorBanner, { top: safeAreaInsets.top + 10 }]}>
          <Feather name="alert-triangle" size={16} color="#ff6b6b" />
          <Text style={styles.errorText}>Please select a folder to continue</Text>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.svgContainer}>
          <FolderPick height={160} />
        </View>
        <View style={styles.pickContainer}>
          <Text style={styles.title}>Choose a Home Folder</Text>
          <Text style={styles.subtitle}>
            This is where FlowPDF will store all your files and folders. You only need to do this once.
          </Text>
          <Pressable style={styles.button} onPress={startPickRootFolder}>
            <Text style={styles.buttonText}>Select Root Folder</Text>
          </Pressable>
        </View>
      </View>
      
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',  // was #2e2e2e
    paddingHorizontal: 24,
  },
  svgContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pickContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',  // was white
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',  // was #888
    marginTop: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: 32,
    backgroundColor: '#111',  // was #444
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#ffe5e5',  // was #3d2a2a
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#ffcccc',  // was #ff6b6b33
  },
  errorText: {
    color: '#cc0000',  // was #ff6b6b
    fontSize: 13,
    flex: 1,
  }
})
