import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Dimensions } from 'react-native';
import BottomSheet from '../helpers/BottomSheet';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import colors from '../../colors.json'
import getRarityPath from '../helpers/getRarity';
import getImagePath from '../helpers/getType';
import { useFonts } from 'expo-font';
import { TouchableOpacity as RNGHTouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'

export default function Details({ navigation }) {
    const { t } = useTranslation()
    const [modalVisible, setModalVisible] = useState(false);
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const route = useRoute();
    const receivedData = route.params?.data;
    const [mute, setMute] = useState(true)
    const [resume, setResume] = useState(true)
    const bottomSheetRef = useRef(null);
    const translateY = useSharedValue(screenHeight - 362);
    const [player, setPlayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [styleIndex, setStyleIndex] = useState(0)
    const [assetsIndex, setAssetsIndex] = useState(0)
    const [assets, setAssets] = useState([])
    const [playerData, setPlayerData] = useState({
        bookmarked: false,
    })

    useEffect(() => {
        const data = []
        data.push(...receivedData.displayAssets)
        if (receivedData.images.icon) data.push(
            {
                url: receivedData.images.icon,
                displayAsset: receivedData.name + "_icon"
            }
        )

        setAssets(data)

    }, []);

    const downloadImage = async (imageUrl) => {
        const downloadResumable = FileSystem.createDownloadResumable(
            imageUrl,
            `${FileSystem.cacheDirectory}${assets[assetsIndex].displayAsset}.png`,
            {},
        );

        const downloadedFile = await downloadResumable.downloadAsync()
        await MediaLibrary.createAssetAsync(downloadedFile.uri);
        await FileSystem.deleteAsync(downloadedFile.uri)
        alert('Image downloaded successfully!');
    };

    const [fontsLoaded] = useFonts({
        "Burbank": require('../../assets/fonts/BurbankBigCondensed-Black.ttf'),
        "BurbankSmall": require('../../assets/fonts/Lalezar-Regular.ttf'),
    });

    useEffect(() => {
        let audioPlayer
        async function playAudio() {

            audioPlayer = new Audio.Sound()
            await audioPlayer.loadAsync({
                uri: receivedData.audio
            })

            setPlayer(audioPlayer);
            await audioPlayer.setIsMutedAsync(true)
            setMute(true)
            await audioPlayer.playAsync()
        }

        if (receivedData.audio !== null) playAudio()

        return () => {
            if (audioPlayer) {
                audioPlayer.stopAsync();
                audioPlayer.unloadAsync();
            }
        };
    }, [receivedData.audio])

    const handleTranslationYChange = (value, animated) => {
        if (animated) translateY.value = withSpring((screenHeight + value) + 23, { damping: 15 });
        else translateY.value = (screenHeight + value) + 23
    };

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            height: translateY.value
        };
    });

    function formatTimeAgo(date) {
        const dateTime = new Date(date);
        const currentTime = new Date();

        const timeDifference = Math.abs(currentTime - dateTime);

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} ${t('days_ago_at')} ${formatAMPM(dateTime)}`;
        } else if (hours > 0) {
            return `${hours} ${t('hours_ago_at')} ${formatAMPM(dateTime)}`;
        } else if (minutes > 0) {
            return `${minutes} ${t('minutes_ago_at')} ${formatAMPM(dateTime)}`;
        } else {
            dateTime
            return `${seconds} ${t('seconds_ago_at')} ${formatAMPM(dateTime)}`;
        }
    }

    function formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 12-hour clock format
        minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero
        const timeString = hours + ':' + minutes + ' ' + ampm;
        return timeString;
    }

    if (!fontsLoaded) {
        return null
    }

    const handleBookmarkToggle = () => {
        setPlayerData(prevState => ({
            ...prevState,
            bookmarked: !prevState.bookmarked
        }));
    };

    const renderItems = () => {
        const rows = [];
        const itemsPerRow = 3;
        for (let i = 0; i < assets.length; i += itemsPerRow) {
            const rowItems = assets.slice(i, i + itemsPerRow).map((item, index) => (
                <RNGHTouchableOpacity onPress={() => {
                    setAssetsIndex(index + i)
                    setModalVisible(!modalVisible)
                }} key={index} style={{
                    borderRadius: 10,
                    backgroundColor: 'rgba(1, 1, 1, 0.5)',
                    justifyContent: 'center',
                    marginLeft: index === 0 ? 0 : 5, // No margin for the first item in the row
                }}>
                    <Image
                        source={{ uri: item.url }}
                        style={{
                            borderRadius: 10,
                            width: 107,
                            height: 107
                        }}
                    />
                </RNGHTouchableOpacity>
            ));
            rows.push(
                <View key={i} style={{ flexDirection: 'row', marginBottom: 5 }}>
                    {rowItems}
                </View>
            );
        }
        return rows;
    };

    return (
        <View style={styles.container}>

            <View>
                {
                    assets.length ? (
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(false);
                            }}
                        >
                            <View style={styles.modalContainer}>
                                <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', width: '90%' }}>
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: assets[assetsIndex].url }} style={styles.image} />
                                    </View>
                                    <TouchableOpacity onPress={() => downloadImage(assets[assetsIndex].url)} style={styles.button}>
                                        <Text style={styles.buttonText}>DOWNLOAD</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.button, { backgroundColor: 'red' }]}>
                                        <Text style={styles.buttonText}>CLOSE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    ) : null
                }
            </View>

            <View style={{
                alignItems: 'center',
                flex: 1 // Make the parent view take up the entire screen
            }}>
                {isLoading && (
                    <Animated.View style={[{ width: screenWidth, position: 'absolute', justifyContent: 'center', alignItems: 'center' }, rBottomSheetStyle]}>
                        <Image
                            source={getRarityPath(receivedData.series ? receivedData.series.id : receivedData.rarity.id)}
                            style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
                        />
                        <Text style={{ color: 'white', fontSize: 20 }}>Loading...</Text>
                    </Animated.View>
                )}
                {
                    receivedData.previewVideos.length > 0 && receivedData.previewVideos[styleIndex] ? (
                        <Animated.View style={[{
                            width: screenWidth,
                            position: 'absolute',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start'
                        }, rBottomSheetStyle]}>
                            <Video
                                shouldPlay
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                onReadyForDisplay={() => setIsLoading(false)}
                                useNativeControls={false}
                                isMuted={mute}
                                source={{
                                    uri: receivedData.previewVideos[styleIndex].url,
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            {
                                receivedData.type.id === "emote" ? (
                                    <View style={{
                                        position: 'absolute',
                                        right: 5,
                                        bottom: 30,
                                    }}>
                                        <RNGHTouchableOpacity onPress={() => setMute(!mute)} style={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                            borderRadius: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 5, // Add margin between buttons for spacing
                                        }}>
                                            {
                                                mute ? (
                                                    <Octicons name='mute' size={20} color={"white"} />
                                                ) : (
                                                    <Octicons name='unmute' size={20} color={"white"} />
                                                )
                                            }
                                        </RNGHTouchableOpacity>
                                    </View>
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
                                source={{ uri: styleIndex === 0 ? receivedData.images.icon ? receivedData.images.icon : receivedData.displayAssets.length ? receivedData.displayAssets[0].url : 'https://i.ibb.co/XCDwKHh/HVH5sqV.png' : receivedData.styles[styleIndex].image ? receivedData.styles[styleIndex].image : 'https://i.ibb.co/XCDwKHh/HVH5sqV.png' }}
                                style={{ width: '100%', aspectRatio: 3 / 3 }}
                            />
                            {
                                receivedData.audio && player ? (
                                    <View style={{
                                        flexDirection: 'row',
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 30,
                                    }}>
                                        <RNGHTouchableOpacity onPress={async () => {
                                            if (player) {
                                                await player.setIsMutedAsync(!mute);
                                                setMute(!mute);
                                            }
                                        }} style={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                            borderRadius: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 5, // Add margin between buttons for spacing
                                        }}>
                                            {
                                                mute ? (
                                                    <Octicons name='mute' size={20} color={"white"} />
                                                ) : (
                                                    <Octicons name='unmute' size={20} color={"white"} />
                                                )
                                            }
                                        </RNGHTouchableOpacity>
                                        <RNGHTouchableOpacity onPress={async () => {
                                            if (player) {
                                                if (resume) await player.pauseAsync(!resume)
                                                else await player.playAsync(resume)
                                                setResume(!resume);
                                            }
                                        }} style={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                            borderRadius: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            {
                                                resume ? (
                                                    <Ionicons name='pause-outline' size={20} color={"white"} />
                                                ) : (
                                                    <Ionicons name='play' size={20} color={"white"} />
                                                )
                                            }
                                        </RNGHTouchableOpacity>
                                    </View>

                                ) : null
                            }
                        </Animated.View>
                    )
                }
            </View>

            <BottomSheet ref={bottomSheetRef} type='details' onTranslationYChange={handleTranslationYChange} background={colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors}>
                <View style={{
                    marginTop: 20,
                    marginHorizontal: 20,
                    padding: 0,
                }}>
                    <View style={{
                        alignItems: 'flex-start',
                        marginBottom: 5,
                        elevation: 3
                    }}>
                        <View style={{
                            padding: 4,
                            backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1,
                            flexDirection: 'row',
                            alignItems: 'left',
                            justifyContent: 'center',
                            borderRadius: 4,
                        }}>
                            <Image source={getImagePath(receivedData.type.id)} style={{
                                width: 15,
                                height: 15,
                                tintColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color3,
                                marginRight: 5,
                                marginLeft: 5
                            }} />
                            <Text style={{
                                color: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color3,
                                fontFamily: i18next.language === "ar" ? "BurbankSmall" : "Burbank",
                                marginRight: 5,
                                textAlign: 'center',
                                justifyContent: 'center'
                            }}>{receivedData.series ? receivedData.series.name.toUpperCase() : receivedData.rarity.name.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={{
                        justifyContent: 'space-between',
                    }}>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{
                                color: "white",
                                marginLeft: 5,
                                fontSize: 30,
                                fontFamily: i18next.language === "ar" ? "BurbankSmall" : "Burbank"
                            }}>{receivedData.name.toUpperCase()}</Text>

                            <RNGHTouchableOpacity onPress={handleBookmarkToggle} style={{
                                height: 40,
                                width: 40,
                                elevation: 10,
                                borderRadius: 5,
                                backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color3,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {
                                    playerData.bookmarked ? (
                                        <Octicons name="bookmark-slash" size={20} color={"white"} />
                                    ) : (
                                        <Octicons name="bookmark" size={20} color={"white"} />
                                    )
                                }
                            </RNGHTouchableOpacity>
                        </View>

                        {
                            receivedData.battlepass ? (
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 15,
                                    alignItems: 'center'
                                }}>
                                    <Image source={require('../../assets/cosmetics/others/bpstarold.png')} style={{
                                        width: 30,
                                        height: 30,
                                        marginRight: 5,
                                    }} />
                                    <Text style={{
                                        color: "white",
                                        fontSize: 25,
                                        fontFamily: i18next.language === "ar" ? "BurbankSmall" : "Burbank"
                                    }}>{receivedData.battlepass.displayText.chapterSeason.toUpperCase()}</Text>
                                </View>
                            ) : (
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 15,
                                    alignItems: 'center'
                                }}>
                                    <Image source={require('../../assets/cosmetics/others/vbucks.png')} style={{
                                        width: 30,
                                        height: 30,
                                        marginRight: 5,
                                    }} />
                                    <Text style={{
                                        color: "white",
                                        fontSize: 25,
                                        fontFamily: "Burbank"
                                    }}>{receivedData.shopHistory ? receivedData.price === 0 ? "FREE" : receivedData.price : "UNRELEASED"}</Text>
                                </View>
                            )
                        }
                    </View>

                </View>

                <View style={{ flex: 1 }}>
                    {
                        receivedData.styles.length ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 10,
                                }}>
                                    {
                                        receivedData.styles.map((item, index) => (
                                            <View key={index}>
                                                <RNGHTouchableOpacity onPress={() => setStyleIndex(index)} style={{
                                                    marginRight: 5,
                                                    height: 50,
                                                    width: 50,
                                                    borderRadius: 5,
                                                }}>
                                                    <Image style={{ position: 'absolute', borderRadius: 5, width: '100%', height: '100%' }} source={getRarityPath(receivedData.series ? receivedData.series.id : receivedData.rarity.id)} resizeMode='contain' />
                                                    <Image style={{ position: 'absolute', borderRadius: 5, width: '100%', height: '100%', borderColor: index === styleIndex ? colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1 : colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color2, borderWidth: 3 }} source={{ uri: item.image ? item.image : 'https://i.ibb.co/XCDwKHh/HVH5sqV.png' }} resizeMode='contain' />
                                                </RNGHTouchableOpacity>
                                            </View>

                                        ))

                                    }
                                </View>
                            </ScrollView>
                        ) : null
                    }
                </View>

                <View style={{
                    marginHorizontal: 20,
                    padding: 0,
                }}>
                    <View style={{
                        marginTop: 20,
                        justifyContent: 'center',
                        padding: 10,
                    }}>
                        <View style={styles.row}>
                            <Text style={styles.label}>{t('description')}</Text>
                            <Text style={{ color: 'white' }}>{receivedData.description}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>{t('introduction')}</Text>
                            <Text style={{ color: 'white' }}>{receivedData.introduction ? receivedData.introduction.text : t('no_introduction')}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>{t('set')}</Text>
                            <Text style={{ color: 'white' }}>{receivedData.set !== null ? receivedData.set.partOf : t('no_set')}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>{t('first_seen')}</Text>
                            <Text style={{ color: 'white' }}>{receivedData.releaseDate ? formatTimeAgo(receivedData.releaseDate) : t('never_released')}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>{t('last_seen')}</Text>
                            <Text style={{ color: 'white' }}>{receivedData.lastAppearance ? formatTimeAgo(receivedData.lastAppearance) : t('never_released')}</Text>
                        </View>
                    </View>

                    <RNGHTouchableOpacity style={{
                        marginTop: 10,
                        width: '100%',
                        backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1,
                        paddingVertical: 5,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Octicons name='bell' size={24} color={"white"} style={{ marginRight: 5 }} />
                        <Text style={{
                            color: 'white',
                            fontSize: 25,
                            fontFamily: i18next.language === "ar" ? "BurbankSmall" : "Burbank"
                        }}>{t('remind_me')}</Text>
                    </RNGHTouchableOpacity>

                    <Text style={{
                        color: 'white',
                        fontSize: 10
                    }}>
                        {t('remind_me_desc')}
                    </Text>

                    <View>
                        <Text style={{
                            color: 'white',
                            fontFamily: i18next.language === "ar" ? "BurbankSmall" : "Burbank",
                            marginTop: 10,
                            fontSize: 20,
                        }}>{t('rate')} {receivedData.name.toUpperCase()} {receivedData.type.name.toUpperCase()}</Text>

                        <RNGHTouchableOpacity style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color2 }, styles.TouchableOpacityContainer]}>
                            <View style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1, width: '20%' }, styles.TouchableOpacityStyle]}>
                                <Text style={{ fontSize: 25, position: 'absolute', left: 5 }}>😱</Text>
                            </View>
                            <Text style={{ fontSize: 25, position: 'absolute', right: 5, fontFamily: "Burbank", color: "white" }}>20%</Text>
                        </RNGHTouchableOpacity>

                        <RNGHTouchableOpacity style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color2 }, styles.TouchableOpacityContainer]}>
                            <View style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1, width: '44%' }, styles.TouchableOpacityStyle]}>
                                <Text style={{ fontSize: 25, position: 'absolute', left: 5 }}>❤️</Text>
                            </View>
                            <Text style={{ fontSize: 25, position: 'absolute', right: 5, fontFamily: "Burbank", color: "white" }}>44%</Text>
                        </RNGHTouchableOpacity>

                        <RNGHTouchableOpacity style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color2 }, styles.TouchableOpacityContainer]}>
                            <View style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1, width: '51%' }, styles.TouchableOpacityStyle]}>
                                <Text style={{ fontSize: 25, position: 'absolute', left: 5 }}>🙂</Text>
                            </View>
                            <Text style={{ fontSize: 25, position: 'absolute', right: 5, fontFamily: "Burbank", color: "white" }}>51%</Text>
                        </RNGHTouchableOpacity>

                        <RNGHTouchableOpacity style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color2 }, styles.TouchableOpacityContainer]}>
                            <View style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1, width: '33%' }, styles.TouchableOpacityStyle]}>
                                <Text style={{ fontSize: 25, position: 'absolute', left: 5 }}>🤢</Text>
                            </View>
                            <Text style={{ fontSize: 25, position: 'absolute', right: 5, fontFamily: "Burbank", color: "white" }}>33%</Text>
                        </RNGHTouchableOpacity>

                        <RNGHTouchableOpacity style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color2 }, styles.TouchableOpacityContainer]}>
                            <View style={[{ backgroundColor: colors.cosmetics[receivedData.series ? receivedData.series.id : receivedData.rarity.id].colors.Color1, width: '12%' }, styles.TouchableOpacityStyle]}>
                                <Text style={{ fontSize: 25, position: 'absolute', left: 5 }}>💩</Text>
                            </View>
                            <Text style={{ fontSize: 25, position: 'absolute', right: 5, fontFamily: "Burbank", color: "white" }}>12%</Text>
                        </RNGHTouchableOpacity>
                        <Text style={{
                            color: 'white',
                            fontSize: 10
                        }}>{t('voters_p1')} 6231 {t('voters_p2')}</Text>

                    </View>

                    {
                        assets.length ? (
                            <View>
                                <Text style={{
                                    color: 'white',
                                    fontFamily: i18next.language === "ar" ? "BurbankSmall" : "Burbank",
                                    marginTop: 10,
                                    fontSize: 20,
                                    textAlign: 'left',
                                }}>{receivedData.name.toUpperCase()} {receivedData.type.name.toUpperCase()} {t('assets')}</Text>

                                <View style={{
                                    justifyContent: 'center',
                                    marginBottom: 50
                                }}>

                                    {renderItems()}

                                </View>
                            </View>
                        ) : null
                    }
                </View>

            </BottomSheet>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    row: {
        maxWidth: '70%',
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        minWidth: 80,
        marginRight: 30,
        textAlign: 'right',
        textAlign: 'left',
        color: 'white'
    },
    TouchableOpacityContainer: {
        width: '100%',
        height: 40,
        borderRadius: 5,
        marginBottom: 5,
        position: 'relative',
        justifyContent: 'center',
    },
    TouchableOpacityStyle: {
        height: 40,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        justifyContent: 'center',
        position: 'relative'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    button: {
        backgroundColor: 'lightgreen',
        width: '100%',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 25,
        color: 'white',
        fontFamily: i18next.language === "ar" ? "BurbankSmall" : "Burbank"
    },
});
