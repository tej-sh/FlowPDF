import { StyleSheet, View } from "react-native";
import { PdfViewerMain } from "@/components/Pdf/PdfViewerMain";
export default function PdfScreen() {

    return (
        <View style={styles.container}>
            <PdfViewerMain />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
