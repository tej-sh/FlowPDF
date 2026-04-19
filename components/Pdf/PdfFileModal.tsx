// components/Pdf/PdfFileModal.tsx
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Source = {
    id: number;
    uri: string;
    cache?: boolean;
}

type Props = {
    visible: boolean;
    sources: Source[];
    currentSource: Source;
    onSelect: (source: Source) => void;
    onClose: () => void;
}

function fileName(uri: string) {
    return uri.split('/').pop();
}

export function PdfFileModal({ visible, sources, currentSource, onSelect, onClose }: Props) {
    const [searchQuery, setSearchQuery] = useState('')
    const filteredSources = sources.filter(source => fileName(source.uri)?.toLowerCase().includes(searchQuery.toLowerCase()))   
    return (
        <Modal animationType="fade" visible={visible} transparent={true}>
            <Pressable style={styles.ModalContainer} onPress={onClose}>
                <Pressable style={styles.ModalContent} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.ModalInputContainer}>
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor="#2e2e2e"
                            style={styles.SearchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Pressable onPress={searchQuery ? () => setSearchQuery('') : onClose}>
                            <Ionicons name="close" size={22} color="#888" />
                        </Pressable>
                    </View>
                    <View style={styles.Separator} />
                    <FlatList
                        data={filteredSources}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => { onSelect(item); onClose(); }}
                                style={[styles.FlatListPressable, item.id === currentSource.id && styles.FlatListActive]}
                            >
                                <FontAwesome6 name="file-pdf" size={14} color={item.id === currentSource.id ? '#fff' : '#333'} />
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={[styles.fileText, { color: item.id === currentSource.id ? '#fff' : '#333', flex: 1 }]}
                                >
                                    {fileName(item.uri)}
                                </Text>
                            </Pressable>
                        )}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.7)",

    },
    ModalContent: {
        width: '85%',
        maxHeight: '70%',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        elevation: 1,
    },
    ModalInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    SearchInput: {
        backgroundColor: 'transparent',
        width: '90%',
        fontSize: 18,
        color: '#2e2e2e',
        // fontWeight: '700',
        flex: 1
    },
    Separator: {
        height: 1, backgroundColor: '#e0e0e0', marginBottom: 10
    },
    FlatListPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 5,
        padding: 10,
        marginHorizontal: 4,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    FlatListActive: {
        backgroundColor: '#434343',
    },
    fileText: {
        fontSize: 14,
    }
})
const cardStyles = StyleSheet.create({
    container: { backgroundColor: '#ffffff', padding: 12, borderRadius: 12, },
    folderName: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 8 },
    fileItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3 },
    fileName: { fontSize: 13, color: '#666', flex: 1 },
    footer: { alignItems: 'flex-end', marginTop: 8 },
})