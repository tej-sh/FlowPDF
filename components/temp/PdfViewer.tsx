import { FontAwesome6 } from '@expo/vector-icons';
import { Asset } from "expo-asset";
import { useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Pdf from "react-native-pdf-jsi";
import { SafeAreaView } from "react-native-safe-area-context";

export function PdfViewer() {
    const sources = [
        { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true, name: 'MC Unit1.pdf' },
        { uri: Asset.fromModule(require('../../assets/example-pdfs/test1.pdf')).uri, cache: true, name: 'MC Unit2.pdf' },
    ];
    const getFileName = (uri: string) => {
        console.log(uri);
        return uri.split("/").pop();
    };

    const [source, setSource] = useState(sources[0]);
    const LastPage = useRef<Record<string, number>>({});
    const initialPage = LastPage.current[source.uri] || 1;
    const [modalVisible, setModalVisible] = useState(false);
    const [showFileOptions, setShowFileOptions] = useState(true);
    
    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => modalVisible ? setModalVisible(false) : setModalVisible(true)}
                style={[styles.OpenModel, { display: showFileOptions ? 'flex' : 'none' }]}>
                <FontAwesome6 name="file-lines" size={24} color="#fff" />
            </Pressable>
            <Animated.View
                style={{
                    backgroundColor: '#1d1d1d',
                    position: showFileOptions ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                }}>
                <SafeAreaView edges={['top']} style={{ backgroundColor: '#1d1d1d',paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, marginHorizontal: 20, paddingBottom: 0 }}>
                        <Text style={styles.Text}>PDF Viewer</Text>
                    </View>

                </SafeAreaView>
            </Animated.View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.ModalContainer}>

                    <View style={styles.ModalContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1, paddingHorizontal: 12, zIndex: 1 }}>
                            <TextInput
                                placeholder="Search..."
                                placeholderTextColor="#2e2e2e"
                                style={{
                                    backgroundColor: 'transparent',
                                    width: '90%',
                                    padding: 12,
                                    paddingHorizontal: 4,
                                    fontSize: 16,
                                    borderRadius: 5,

                                }}
                            />
                        </View>
                        <View style={styles.Separator} />
                        <FlatList
                            data={sources}
                            keyExtractor={(item) => item.uri}
                            renderItem={({ item }) => (
                                <View>
                                    <Pressable onPress={() => {
                                        setSource(item);
                                        setModalVisible(false);
                                    }}
                                        style={styles.FlatListPressable}
                                    >
                                        <Text style={{ color: '#333' }}>{getFileName(item.uri)}</Text>
                                    </Pressable>
                                </View>

                            )}
                        ></FlatList>
                    </View>

                </View>
            </Modal>
            <Pdf
                pdfId='pdff'
                key={source.uri}
                source={source}
                page={initialPage}
                trustAllCerts={false}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`number of pages: ${numberOfPages}`);
                    console.log(`file path: ${filePath}`);
                }}
                scale={0.95}
                minScale={0.25}
                maxScale={3.0}
                renderActivityIndicator={() => 
                <ActivityIndicator color="black" size="large" />}
                onPageChanged={(page, numberOfPages) => {
                    LastPage.current[source.uri] = page;
                    console.log(`current page: ${page}`);
                    console.log(`number of pages: ${numberOfPages}`);

                }}
                showsVerticalScrollIndicator={true}
                enableDoubleTapZoom={false}
                onPageSingleTap={
                    showFileOptions ? () => setShowFileOptions(false) : () => setShowFileOptions(true)
                }
                onError={(error) => {
                    const err = error as Error;
                    alert(err.message);
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`)
                }}
                onLoadProgress={(percentage) => console.log(percentage)}
                style={styles.Pdf}
            />
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#444444',
    },
    Text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    Pdf: {
        flex: 1,
        width: '100%',
        paddingTop: 10,
        backgroundColor: '#444444',
    },
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: 'blur(25px)',
    },
    OpenModel: {
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
    ModalContent: {
        backgroundColor: '#dededc',
        height: 320,
        width: 300,
        borderRadius: 10,
        overflow: 'hidden',
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
});