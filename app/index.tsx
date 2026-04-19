import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { FileSysMain } from "@/components/Folders/fileSysMain";
import { PickFolder } from "@/components/Folders/PickFolder";
import { useRootFolderStore } from "@/store/store";

export default function Index() {
  const router = useRouter();
  const rootFolder = useRootFolderStore((state) => state.rootFolder);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PickFolder />
      {rootFolder ? (
        <FileSysMain />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
            Welcome to FlowPDF
          </Text>
          <Pressable 
            onPress={() => useRootFolderStore.getState().setShowPickFolder(true)}
            style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 10 }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Get Started</Text>
          </Pressable>
        </View>
      )}
      
    </View>
  );
}
