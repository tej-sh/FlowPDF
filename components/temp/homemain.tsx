
import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker'
import { Text, View, StyleSheet, Pressable, TextInput, FlatList, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system'
import { StorageAccessFramework } from 'expo-file-system/legacy'
import { useRootFolderStore } from '../../store/store'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export function FileSysMain() {
  function FolderCard({ item }: { item: { name: string, files: string[] } }) {
    return (
      <View style={{ backgroundColor: '#dedede', padding: 10, borderRadius: 10 }}>
        <Text style={{ fontSize: 18,fontWeight:'bold',paddingTop:5, paddingBottom:10}}>{item.name}</Text>
        {item.files.map((file, index) => (
          <Pressable key={file + index}>
            <Text key={file + index}>{file}</Text>
          </Pressable>
        ))}
        <View style={{alignItems:'flex-end'}}>
          <Ionicons name="ellipsis-vertical-sharp" size={15} />
        </View>
      </View>
    )
  }
  const insets = useSafeAreaInsets()
  const rootFolder = useRootFolderStore((state) => (state.rootFolder))
  const setRootFolder = useRootFolderStore((state) => (state.setRootFolder))
  const data = [
    { 'name': 'folder1', 'files': ['file1', 'file2', 'file3'] },
    { 'name': 'folder2', 'files': ['file1', 'file2', 'file3', 'file4', 'file5'] },
    { 'name': 'folder3', 'files': ['file1', 'file2',] },
    { 'name': 'folder4', 'files': ['file1', 'file2', 'file3', 'file4'] },
    { 'name': 'folder4', 'files': ['file1', 'file2', 'file3', 'file4', 'file1', 'file2', 'file3', 'file4', 'file1', 'file2', 'file3', 'file4'] }
  ]
  const leftColumn = data.filter((_, i) => i % 2 === 0)
  const rightColumn = data.filter((_, i) => i % 2 !== 0)
  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: true,
    })

    if (result.canceled) {
      return
    }
  }

  return (
    <View style={[styles.container]}>
      <StatusBar style='dark'></StatusBar>
      <View style={[styles.HeaderContainer, { paddingTop: insets.top + 5 }]}>
        <View>
          <Text style={styles.title}>FlowPDF</Text>
        </View>
        <Pressable>
          <Ionicons name="settings-sharp" size={20} />
        </Pressable>
      </View>
      <View>
        <TextInput placeholder="Search..." placeholderTextColor={'black'} style={styles.SearchBar} ></TextInput>
      </View>
      <ScrollView contentContainerStyle={{ flexDirection: 'row', padding: 12, gap: 8 }}>
        <View style={{ flex: 1, gap: 8 }}>
          {leftColumn.map(item => <FolderCard key={item.name} item={item} />)}
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          {rightColumn.map(item => <FolderCard key={item.name} item={item} />)}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 24,
  },
  HeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  SearchBar: {
    marginHorizontal:20,
    borderRadius:12,
    backgroundColor:'#DEDEDE',
    paddingVertical:12,
    paddingHorizontal: 20,
    fontSize:18,
  }

});