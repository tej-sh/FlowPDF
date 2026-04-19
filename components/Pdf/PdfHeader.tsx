import { Text, StyleSheet, Animated, Easing, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type PdfHeaderProps = {
    title: string
    active?: boolean
}

export function PdfHeader({ title, active = true }: PdfHeaderProps) {
    const opacity = useRef(new Animated.Value(active ? 1 : 0)).current
    const translateY = useRef(new Animated.Value(active ? 0 : -28)).current
    const router = useRouter()

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: active ? 1 : 0,
                duration: 220,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: active ? 0 : -28,
                duration: 220,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start()
    }, [active, opacity, translateY])

    return (

        <Animated.View
            pointerEvents={active ? 'auto' : 'none'}
            style={[
                styles.HeaderContainer,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <StatusBar style={active ? 'light' : undefined}
                hidden={!active}
            ></StatusBar>
            <SafeAreaView edges={['top']} style={styles.HeaderContent}>
                <View style={styles.TitleRow}>
                    <Pressable onPress={() => router.back()} style={styles.BackButton}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </Pressable>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.PdfHeaderText}>
                        {title}
                    </Text>
                </View>
            </SafeAreaView>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    HeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 10,
    },

    HeaderContent: {
        width: '100%',
        backgroundColor: '#2e2e2e',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },

    TitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        gap: 12, 
    },
    BackButton: {
    padding: 4,
  },
    PdfHeaderText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
})