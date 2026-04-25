import React, { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker'
import { StorageAccessFramework } from 'expo-file-system/legacy'
import {
  Text, View, StyleSheet, Pressable, TextInput, ScrollView,
  Modal, TouchableOpacity
} from 'react-native';
import { useRootFolderStore } from '../../store/store'
import { getColors, ThemeColors } from '../colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy'
import { useRouter } from 'expo-router'
import { FlashList } from "@shopify/flash-list";
import { Background } from '@react-navigation/elements';
import { Feather } from '@expo/vector-icons'

type FileItem = {
  id: number,
  uri: string,
  cache: boolean
}
// onPress={() => router.push({
//   pathname: '/PdfScreen',
//   params: { sources: JSON.stringify(files) }
// })}

//folders cards that appear on main screen 

function FolderCard({ uri, onPress, refresh, colors }: { uri: string, onPress: (files: FileItem[]) => void, refresh: number, colors: ThemeColors }) {
  const router = useRouter()
  const name = decodeURIComponent(uri.split('%2F').pop() || uri.split('/').pop() || 'folder')
  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    async function loadFiles() {
      const contents = await StorageAccessFramework.readDirectoryAsync(uri)
      const sources: FileItem[] = []

      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        const originalName = decodeURIComponent(content.split('%2F').pop() || content.split('/').pop() || `file_${i}.pdf`);
        const localUri = `${FileSystem.cacheDirectory}${originalName}`;

        try {
          await FileSystem.copyAsync({ from: content, to: localUri });
          sources.push({
            'id': i + 1,
            'uri': `file://${localUri}`,
            'cache': true
          });
        } catch (e) {
          console.error("Failed to copy file", content, e);
          sources.push({
            'id': i + 1,
            'uri': content,
            'cache': true
          });
        }
      }
      setFiles(sources)
    }
    loadFiles()
  }, [uri, refresh])

  return (
      <Pressable style={[cardStyles.container, { backgroundColor: colors.cardBackground }]}
        onPress={() => onPress(files)}>
        <Text style={[cardStyles.folderName, { color: colors.text }]}>{name}</Text>
        {files.map((file) => (
          <View key={file.uri + file.id} style={cardStyles.fileItem}>
            <Ionicons name="document-outline" size={13} color={colors.icon} />
            <Text numberOfLines={1} style={[cardStyles.fileName, { color: colors.fileName }]}>
              {decodeURIComponent(file.uri.split('/').pop() || `what the fuck is the filename?`)}
            </Text>
          </View>
        ))}
      </Pressable>
  )
}
//folders expanded card
function ExpandSelectedFolder({ uri, onClose, onRefresh, initialFiles, colors }: {
  uri: string,
  onClose: () => void,
  onRefresh: () => void,
  initialFiles: FileItem[],
  colors: ThemeColors
}) {
  const name = decodeURIComponent(uri.split('%2F').pop() || uri.split('/').pop() || 'folder')
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const router = useRouter()
  useEffect(() => {
    async function loadFiles() {
      if (!uri) return
      const contents = await StorageAccessFramework.readDirectoryAsync(uri)
      const sources: FileItem[] = []

      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        const originalName = decodeURIComponent(content.split('%2F').pop() || content.split('/').pop() || `file_${i}.pdf`);
        const localUri = `${FileSystem.cacheDirectory}${originalName}`;

        try {
          await FileSystem.copyAsync({ from: content, to: localUri });
          sources.push({
            'id': i + 1,
            'uri': `file://${localUri}`,
            'cache': true
          });
        } catch (e) {
          console.error("Failed to copy file", content, e);
          sources.push({
            'id': i + 1,
            'uri': content,
            'cache': true
          });
        }
      }
      setFiles(sources)
    }
    loadFiles()
  }, [uri])

  async function addFiles() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: true,
    })
    if (result.canceled) return
    for (const file of result.assets) {
      const newUri = await StorageAccessFramework.createFileAsync(uri, file.name, 'application/pdf')
      const content = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 })
      await FileSystem.writeAsStringAsync(newUri, content, { encoding: FileSystem.EncodingType.Base64 })
    }

    // Refresh the files properly after adding new ones
    const contents = await StorageAccessFramework.readDirectoryAsync(uri)
    const sources: FileItem[] = []
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      const originalName = decodeURIComponent(content.split('%2F').pop() || content.split('/').pop() || `file_${i}.pdf`);
      const localUri = `${FileSystem.cacheDirectory}${originalName}`;
      try {
        await FileSystem.copyAsync({ from: content, to: localUri });
        sources.push({ id: i + 1, uri: `file://${localUri}`, cache: true });
      } catch (e) {
        sources.push({ id: i + 1, uri: content, cache: true });
      }
    }
    setFiles(sources)
    onRefresh()
  }

  return (
    <Pressable style={[styles.ExpandFolderMain, { backgroundColor: colors.cardBackground }]}
      onPress={(e) => e.stopPropagation()}>
      <View style={styles.ExpandFolderHeader}>
        <Text numberOfLines={1} style={[styles.ExpandFolderName, { color: colors.text }]}>{name}</Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Pressable onPress={() => { console.log('new goddamn feature when?') }}>
            <Feather name="edit" size={19} color={colors.icon} />
          </Pressable>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.icon} />
          </Pressable>
        </View>
      </View>
      <View style={[styles.ExpandSeparator, { backgroundColor: colors.border }]} />
      {files.length === 0 ? (
        <View style={styles.EmptyState}>
          <Ionicons name="document-outline" size={32} color={colors.iconSecondary} />
          <Text style={[styles.EmptyText, { color: colors.textTertiary }]}>No files yet</Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: 350 }}>
          {files.map((file, index) => (
            <Pressable onPress={() => {
              onClose()
              router.push({
                pathname: '/PdfScreen',
                params: { sources: JSON.stringify(files), current: index }
              })
            }} key={index} style={styles.ExpandFilesView}>
              <Ionicons name="document-outline" size={20} color={colors.icon} />
              <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.ExpandFileName, { color: colors.fileNameActive }]}>
                {decodeURIComponent(file.uri.split('/').pop() || '')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <View>
        <Pressable style={[styles.AddFilesButton, { backgroundColor: colors.buttonBackground }]} onPress={addFiles}>
          <Ionicons name="add" size={18} color={colors.buttonText} />
          <Text style={[styles.AddFilesText, { color: colors.buttonText }]}> Add files</Text>
        </Pressable>
      </View>
    </Pressable>
  )
}

export function FileSysMain() {
  const insets = useSafeAreaInsets()
  const [search, setSearch] = useState('')
  const rootFolder = useRootFolderStore((state) => state.rootFolder)
  const [folders, setFolders] = useState<string[]>([])
  const [refresh, setRefresh] = useState(0)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [expandFolder, setExpandFolder] = useState(false)
  const [selectedFolderUri, setSelectedFolderUri] = useState('')
  const [selectedFolderFiles, setSelectedFolderFiles] = useState<FileItem[]>([])

  // TODO: Replace with dynamic theme selection if needed
  const color = "dark"
  const colors = getColors(color)

  useEffect(() => {
    async function loadFolders() {
      if (!rootFolder) return
      const contents = await StorageAccessFramework.readDirectoryAsync(rootFolder)
      setFolders(contents)
    }
    loadFolders()
  }, [rootFolder, refresh])

  const filteredFolders = folders.filter(uri => {
    const name = decodeURIComponent(uri.split('%2F').pop() || '')
    return name.toLowerCase().includes(search.toLowerCase())
  })

  async function createFolder(folderName: string) {
    await StorageAccessFramework.createFileAsync(
      rootFolder,
      folderName,
      'vnd.android.document/directory'
    )
    setRefresh(v => v + 1)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style='light' />
      <Modal visible={showCreateFolder} transparent={true}>
        <Pressable style={styles.ModalContainer} onPress={() => setShowCreateFolder(false)}>
          <Pressable style={[styles.Modal, { backgroundColor: colors.cardBackground }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.ModalTitle, { color: colors.text }]}>New Workspace</Text>
            <TextInput
              style={[styles.ModalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder='Workspace name'
              placeholderTextColor={colors.textTertiary}
              autoFocus
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <View style={styles.ModalButtons}>
              <Pressable style={[styles.CancelButton, { backgroundColor: colors.background }]} onPress={() => setShowCreateFolder(false)}>
                <Text style={[styles.CancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.CreateButton, { backgroundColor: colors.buttonBackground }]} onPress={() => {
                if (newFolderName.trim() !== '') {
                  createFolder(newFolderName)
                  setNewFolderName('')
                  setShowCreateFolder(false)
                }
              }}>
                <Text style={[styles.CreateText, { color: colors.buttonText }]}>Create</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={expandFolder} transparent={true}>
        <Pressable
          style={styles.ExpandFolderModalContainer}
          onPress={() => {
            setExpandFolder(false)
            setRefresh(v => v + 1)
          }}
        >
          <ExpandSelectedFolder
            key={selectedFolderUri}
            uri={selectedFolderUri}
            onClose={() => {
              setExpandFolder(false)
              setRefresh(v => v + 1)
            }}
            onRefresh={() => setRefresh(v => v + 1)}
            initialFiles={selectedFolderFiles}
            colors={colors}
          />
        </Pressable>
      </Modal>

      <View style={[styles.headerContainer, { paddingTop: insets.top + 5 }]}>
        <Text style={[styles.title, { color: colors.text }]}>FlowPDF</Text>
        <View style={styles.headerIcons}>
          {/* <Pressable onPress={() => setShowCreateFolder(true)}>
            <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
          </Pressable> */}
          <Pressable>
            <Ionicons name="settings-sharp" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <Ionicons name="search" size={16} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search folders..."
          placeholderTextColor={colors.textTertiary}
          style={[styles.searchBar, { color: colors.text }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlashList
        data={filteredFolders}
        masonry
        numColumns={2}
        keyExtractor={(item) => item}
        renderItem={({ item: uri }) => (
          <View style={{ padding: 4 }}>
            <FolderCard
              uri={uri}
              onPress={(files) => {
                setSelectedFolderUri(uri)
                setSelectedFolderFiles(files)
                setExpandFolder(true)
              }}
              refresh={refresh}
              colors={colors}
            />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
      />

      <Pressable
        style={[styles.newWorkspaceButton, { zIndex: 10, elevation: 10 }]}
        onPress={() => setShowCreateFolder(true)}
      >
        {/* <FontAwesome6 name="folder-tree" size={18} color={colors.buttonText} /> */}
        <Ionicons name="add" size={20} color={'#0c1545c4'} />

        <Text style={styles.newWorkspaceButtonText}> New Space </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  scrollContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 8
  },
  column: {
    flex: 1,
    gap: 8
  },
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  Modal: {
    width: 300,
    borderRadius: 16,
    padding: 20,
    gap: 16
  },
  ModalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  ModalInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  ModalButtons: {
    flexDirection: 'row',
    gap: 10
  },
  CancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  CancelText: {
    fontWeight: '500'
  },
  CreateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  CreateText: {
    fontWeight: '600'
  },
  ExpandFolderModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ExpandFolderMain: {
    width: '85%',
    flexShrink: 1,
    padding: 16,
    borderRadius: 16,
  },
  ExpandFolderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ExpandFolderName: {
    fontSize: 20,
    fontWeight: '700', flex: 1
  },
  ExpandSeparator: {
    height: 1,
    marginBottom: 10
  },
  EmptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8
  },
  EmptyText: {
    fontSize: 14
  },
  ExpandFilesView: {
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 1,
  },
  ExpandFileName: {
    fontSize: 14,
    flex: 1
  },

  AddFilesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  AddFilesText: {
    fontWeight: '600',
    fontSize: 15
  },


  newWorkspaceButton: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 10,
    bottom: 40,
    right: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#88b2e2',
    marginBottom: 8,
  },


  newWorkspaceButtonText: {
    color: '#0c1545c4',
    fontSize: 15,
    fontWeight: '500',
  },


})

const cardStyles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    elevation: 1,
  },
  folderName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 3
  },
  fileName: {
    fontSize: 13,
    flex: 1
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 8
  },
})