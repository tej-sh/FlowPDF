import React, { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker'
import { StorageAccessFramework } from 'expo-file-system/legacy'
import {
  Text, View, StyleSheet, Pressable, TextInput, ScrollView,
  Modal
} from 'react-native';
import { useRootFolderStore } from '../../store/store'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy'
import { useRouter } from 'expo-router'
import { FlashList } from "@shopify/flash-list";

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

function FolderCard({ uri, onPress, refresh }: { uri: string, onPress: (files: FileItem[]) => void, refresh: number }) {
  const router = useRouter()
  const name = decodeURIComponent(uri.split('%2F').pop() || uri.split('/').pop() || 'folder')
  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    async function loadFiles() {
      const contents = await StorageAccessFramework.readDirectoryAsync(uri)
      const sources: FileItem[] = []

      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        // Extract the original filename from the content URI
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
    <Pressable style={cardStyles.container} onPress={() => onPress(files)}>
      <Text style={cardStyles.folderName}>{name}</Text>
      {files.map((file) => (
        <View key={file.uri + file.id} style={cardStyles.fileItem}>
          <Ionicons name="document-outline" size={13} color="#888" />
          <Text numberOfLines={1} style={cardStyles.fileName}>

            {decodeURIComponent(file.uri.split('/').pop() || `what the fuck is the filename?`)}
          </Text>
        </View>
      ))}
      {/* <Pressable style={cardStyles.footer} onPress={() => router.push({
        pathname: '/PdfScreen',
        params: { sources: JSON.stringify(files), current: 0 }
      })}>
        <Ionicons name="ellipsis-horizontal" size={15} color="#aaa" />
      </Pressable > */}
    </Pressable>
  )
}
//folders expanded card
function ExpandSelectedFolder({ uri, onClose, onRefresh, initialFiles }: {
  uri: string,
  onClose: () => void,
  onRefresh: () => void,
  initialFiles: FileItem[]
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
    <Pressable style={styles.ExpandFolderMain} onPress={(e) => e.stopPropagation()}>
      <View style={styles.ExpandFolderHeader}>
        <Text numberOfLines={1} style={styles.ExpandFolderName}>{name}</Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {/* <Text>add files</Text> */}
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={22} color="#888" />
          </Pressable>
        </View>

      </View>
      <View style={styles.ExpandSeparator} />
      {files.length === 0 ? (
        <View style={styles.EmptyState}>
          <Ionicons name="document-outline" size={32} color="#ccc" />
          <Text style={styles.EmptyText}>No files yet</Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: 350 }}>
          {files.map((file, index) => (
            <Pressable onPress={() => router.push({
              pathname: '/PdfScreen',
              params: { sources: JSON.stringify(files), current: index }
            })} key={index} style={styles.ExpandFilesView}>
              <Ionicons name="document-outline" size={20} color="#888" />
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.ExpandFileName}>
                {decodeURIComponent(file.uri.split('/').pop() || '')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <View>
        {/* <Pressable style={styles.AddFilesButton} onPress={addFiles}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.AddFilesText}>Add Files</Text>
        </Pressable> */}
        <Pressable style={styles.AddFilesButton} onPress={addFiles}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.AddFilesText}> Add files</Text>
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
    <View style={styles.container}>
      <StatusBar style='dark' />
      <Modal visible={showCreateFolder} transparent={true}>
        <Pressable style={styles.ModalContainer} onPress={() => setShowCreateFolder(false)}>
          <Pressable style={styles.Modal} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.ModalTitle}>New Folder</Text>
            <TextInput
              style={styles.ModalInput}
              placeholder='Folder name'
              placeholderTextColor='#aaa'
              autoFocus
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <View style={styles.ModalButtons}>
              <Pressable style={styles.CancelButton} onPress={() => setShowCreateFolder(false)}>
                <Text style={styles.CancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.CreateButton} onPress={() => {
                if (newFolderName.trim() !== '') {
                  createFolder(newFolderName)
                  setNewFolderName('')
                  setShowCreateFolder(false)
                }
              }}>
                <Text style={styles.CreateText}>Create</Text>
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
          />
        </Pressable>
      </Modal>

      <View style={[styles.headerContainer, { paddingTop: insets.top + 5 }]}>
        <Text style={styles.title}>FlowPDF</Text>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => setShowCreateFolder(true)}>
            <Foundation name="folder-add" size={22} color="#111" />
          </Pressable>
          <Pressable>
            <Ionicons name="settings-sharp" size={22} color="#111" />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color="#aaa" style={styles.searchIcon} />
        <TextInput
          placeholder="Search folders..."
          placeholderTextColor="#aaa"
          style={styles.searchBar}
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
            />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: '100%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111'
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
    backgroundColor: '#ebebeb',
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
    color: '#111'
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
    backgroundColor: '#ffffff',
    width: 300,
    borderRadius: 16,
    padding: 20,
    gap: 16
  },
  ModalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111'
  },
  ModalInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15, color: '#111',
  },
  ModalButtons: {
    flexDirection: 'row',
    gap: 10
  },
  CancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center'
  },
  CancelText: {
    color: '#666',
    fontWeight: '500'
  },
  CreateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center'
  },
  CreateText: {
    color: '#fff',
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
    backgroundColor: '#ffffff',
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
    fontWeight: '700',
    color: '#111', flex: 1
  },
  ExpandSeparator: { height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 },
  EmptyState: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  EmptyText: { color: '#aaa', fontSize: 14 },
  ExpandFilesView: {
    paddingVertical: 10, flexDirection: 'row', gap: 10,
    alignItems: 'center', paddingHorizontal: 12,

  },
  ExpandFileName: { fontSize: 14, color: '#444', flex: 1 },
  AddFilesButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#111', padding: 12, borderRadius: 10, marginTop: 12,
  },
  AddFilesText: { color: '#fff', fontWeight: '600', fontSize: 15 },
})

const cardStyles = StyleSheet.create({
  container: { backgroundColor: '#ffffff', padding: 12, borderRadius: 12, elevation: 1, },
  folderName: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 8 },
  fileItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3 },
  fileName: { fontSize: 13, color: '#666', flex: 1 },
  footer: { alignItems: 'flex-end', marginTop: 8 },
})