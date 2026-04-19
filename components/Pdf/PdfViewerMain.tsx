import { FontAwesome6 } from '@expo/vector-icons';
import { Asset } from "expo-asset";
import { useRef, useState } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Pdf from "react-native-pdf-jsi";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PdfHeader } from "./PdfHeader"
import { useLocalSearchParams } from 'expo-router'
import { PdfFileModal } from './PdfFileModal';

export function PdfViewerMain() {
    const insets = useSafeAreaInsets()
    const { sources: sourcesParam, current } = useLocalSearchParams()

    const sources = sourcesParam ? JSON.parse(sourcesParam as string) : [
        { id: 1, 'uri': 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true },
        { id: 2, 'uri': 'http://samples.leanpub.com/thereactnativebook-samplq.pdf' },
        { id: 3, 'uri': 'http://samples.leanpub.com/thereactnativebook-sample.pdf' }
    ]

    const initialSource = (current && sources[Number(current)]) ? sources[Number(current)] : sources[0]
    const [source, setSource] = useState(initialSource)
    const [showModal, setShowModal] = useState(false)
    const [showHeader, setShowHeader] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages,setTotalPages] = useState(0)
    const LastPage = useRef<Record<string, number>>({});
    const initialPage = LastPage.current[source?.uri] || 1;
    function fileName(uri: string) {
        if (!uri) return ""
        return uri.split('/').pop()
    }

    return (
        <View style={styles.MainContainer}>
            <PdfHeader title={fileName(source?.uri) || "pdf viewer"} active={showHeader} />
            <Pdf
                source={source}
                page={initialPage}
                onPageChanged={(page, pageCount) => {
                    LastPage.current[source?.uri] = page;
                    setCurrentPage(page)
                }}
                onError={(error) => {
                    console.error('PDF Error:', error);
                }}
                style={[styles.Pdf, { paddingTop: insets.top + 40 },
                    {paddingBottom: insets.bottom+40}
                ]}
                onPageSingleTap={() => setShowHeader(v => !v)}
                 onLoadComplete={(numberOfPages, filePath) => {
                    setTotalPages(numberOfPages); // <-- Set immediately upon load
                    setCurrentPage(LastPage.current[source?.uri] || 1); // <-- Reset to first page on new load
                }}
            />
            <View style={{ position: 'absolute', bottom: 20, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    {currentPage}/{totalPages}
                </Text>
            </View>
            <Pressable
                onPress={() => setShowModal(v => !v)}
                style={[styles.ShowModal, { display: showHeader ? 'flex' : 'none' }]}

            >
                <FontAwesome6 name="file-lines" size={24} color="#fff" />
            </Pressable>
            <PdfFileModal
                visible={showModal}
                sources={sources}
                currentSource={source}
                onSelect={setSource}
                onClose={() => setShowModal(false)}
            />

        </View>
    )
}


const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        // backgroundColor: '#444444',
    },
    Pdf: {
        flex: 1,
        width: '100%'
    },
    ShowModal: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        width: 50,
        zIndex: 2,
        backgroundColor: '#2e2e2e',
        borderRadius: '50%',
    },

    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: 'blur(25px)',
    },

    ModalContent: {
        backgroundColor: '#dededc',
        height: 320,
        width: 300,
        borderRadius: 10,
        overflow: 'hidden',
    },

    ModalInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
        paddingHorizontal: 12,
        zIndex: 1
    },

    Separator: {
        height: 1,
        backgroundColor: "#ccc",
        width: '100%',
    },
    FlatListPressable: {
        backgroundColor: '#cbcac8',
        padding: 10,
        marginHorizontal: 12,
        marginTop: 5,
        borderRadius: 5,
        display: 'flex',
    }


})