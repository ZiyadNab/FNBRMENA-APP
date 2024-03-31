import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react'
import {
    StyleSheet, Text, View, TextInput, ActivityIndicator,
    RefreshControl, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Dimensions } from 'react-native';
import BottomSheet from '../helpers/BottomSheet';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

export default function Details({ navigation }) {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const route = useRoute();
    const receivedData = route.params?.data;
    const [mute, setMute] = useState(true)
    const bottomSheetRef = useRef(null);
    const translateY = useSharedValue(screenHeight - 280);
    const [player, setPlayer] = useState(null);

    useEffect(() => {

        async function playAudio() {

            const audioPlayer = new Audio.Sound()
            await audioPlayer.loadAsync({
                uri: receivedData.audio
            })

            setPlayer(audioPlayer);
            await audioPlayer.playAsync()
            await player.setIsMutedAsync(mute)
        }

        if (receivedData.audio !== null) playAudio()

        return () => {
            if (player) {
                player.stopAsync();
                player.unloadAsync();
            }
        };
    }, [receivedData.audio])

    const getRarityPath = (rarity) => {
        const rarityLower = rarity.toLowerCase();
        switch (rarityLower) {
            case 'cubeseries':
                return require('../../assets/cosmetics/rarities/dark.png');
            case 'frozenseries':
                return require('../../assets/cosmetics/rarities/frozen.png');
            case 'creatorcollabseries':
                return require('../../assets/cosmetics/rarities/icon.png');
            case 'slurpseries':
                return require('../../assets/cosmetics/rarities/slurp.png');
            case 'marvelseries':
                return require('../../assets/cosmetics/rarities/marvel.png');
            case 'lavaseries':
                return require('../../assets/cosmetics/rarities/lava.png');
            case 'shadowseries':
                return require('../../assets/cosmetics/rarities/shadow.png');
            case 'platformseries':
                return require('../../assets/cosmetics/rarities/gaming.png');
            case 'dcuseries':
                return require('../../assets/cosmetics/rarities/dc.png');
            case 'columbusseries':
                return require('../../assets/cosmetics/rarities/starwars.png');
            case 'legendary':
                return require('../../assets/cosmetics/rarities/legendary.png');
            case 'epic':
                return require('../../assets/cosmetics/rarities/epic.png');
            case 'rare':
                return require('../../assets/cosmetics/rarities/rare.png');
            case 'uncommon':
                return require('../../assets/cosmetics/rarities/uncommon.png');
            case 'common':
                return require('../../assets/cosmetics/rarities/common.png');
            default:
                return require('../../assets/cosmetics/rarities/common.png');
        }
    };

    const handleTranslationYChange = (value, animated) => {
        if (animated) translateY.value = withSpring((screenHeight + value) + 20, { damping: 15 });
        else translateY.value = (screenHeight + value) + 20
    };

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            height: translateY.value
        };
    });

    return (
        <View style={styles.container}>

            <View style={{
                alignItems: 'center',
                flex: 1 // Make the parent view take up the entire screen
            }}>
                {
                    receivedData.previewVideos.length > 0 ? (
                        <Animated.View style={[{
                            width: screenWidth,
                            position: 'absolute',
                            flexDirection: 'row', // Add flexDirection to align items horizontally
                            justifyContent: 'flex-start', // Align items to the start (left) of the parent
                            alignItems: 'flex-start'
                        }, rBottomSheetStyle]}>
                            <Video
                                shouldPlay
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                useNativeControls={false}
                                isMuted={mute}
                                source={{
                                    uri: receivedData.previewVideos[0].url,
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            {
                                receivedData.type.id === "emote" ? (
                                    <TouchableOpacity onPress={() => setMute(!mute)} style={{
                                        width: 40,
                                        height: 40,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        position: 'absolute',
                                        borderRadius: 20,
                                        right: 10,
                                        bottom: 30,
                                    }}>
                                        {
                                            mute ? (
                                                <Octicons name='mute' size={20} color={"white"} />
                                            ) : (
                                                <Octicons name='unmute' size={20} color={"white"} />
                                            )
                                        }
                                    </TouchableOpacity>
                                ) : null
                            }
                        </Animated.View>
                    ) : (
                        <Animated.View style={[{
                            width: screenWidth,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                        }, rBottomSheetStyle]}>
                            <Image
                                source={getRarityPath(receivedData.series ? receivedData.series.id : receivedData.rarity.id)}
                                style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
                            />
                            <Image
                                source={{ uri: receivedData.images.icon }}
                                onError={() => ({ uri: 'https://imgur.com/HVH5sqV.png' })}
                                style={{ width: '100%', aspectRatio: 3 / 3 }}
                            />
                            <TouchableOpacity onPress={async () => {
                                if (player) {
                                    await player.setIsMutedAsync(!mute);
                                    setMute(!mute);
                                  }
                            }} style={{
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                position: 'absolute',
                                borderRadius: 20,
                                right: 10,
                                bottom: 30,
                            }}>
                                {
                                    mute ? (
                                        <Octicons name='mute' size={20} color={"white"} />
                                    ) : (
                                        <Octicons name='unmute' size={20} color={"white"} />
                                    )
                                }
                            </TouchableOpacity>
                        </Animated.View>
                    )
                }
            </View>

            <BottomSheet ref={bottomSheetRef} onTranslationYChange={handleTranslationYChange}>

            </BottomSheet>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
});
