import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import axios from 'axios'
import { TouchableOpacity as RNGHTouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import AutoScrollingScrollView from '../helpers/imageSlider'

export default function Quests({ navigation }) {
    const { t } = useTranslation()
    let cachedLanguage = i18next.language;

    const CACHE_FILE_URI = `${FileSystem.documentDirectory}shop_cached_data.json`;
    const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

    const [loading, setLoading] = useState(true)
    const [shop, setShop] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [section, setSections] = useState([])

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            let cachedData = null;
            await FileSystem.getInfoAsync(CACHE_FILE_URI)
                .then(async i => {
                    if (i.exists) {
                        const currentTime = new Date().getTime();
                        const modificationTimeMilliseconds = i.modificationTime * 1000

                        // Check if cached data is expired
                        if (currentTime - modificationTimeMilliseconds < CACHE_EXPIRATION_TIME) {

                            // If not expired, read cached data
                            cachedData = await FileSystem.readAsStringAsync(CACHE_FILE_URI);
                        }
                    }

                    if (!cachedData || i18next.language !== cachedLanguage) {

                        // Fetch data from API if no cached data or expired
                        const response = await axios(`https://fortniteapi.io/v2/shop?lang=${i18next.language}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,apiTags,upcoming,releaseDate,lastAppearance,images,juno,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets`, {
                            headers: {
                                'Authorization': 'd4ce1562-839ff66b-3946ccb6-438eb9cf'
                            }
                        })

                        const jsonData = await response.data;

                        // Save fetched data to cache
                        await FileSystem.writeAsStringAsync(CACHE_FILE_URI, JSON.stringify(jsonData), { encoding: FileSystem.EncodingType.UTF8 })
                        cachedData = JSON.stringify(jsonData);
                        cachedLanguage = i18next.language
                    }

                    function convertToSectionsWithItems(data) {
                        const sectionsMap = new Map();

                        // Group items by section ID
                        data.forEach(item => {
                            const sectionId = item.section.id;
                            if (!sectionsMap.has(sectionId)) {
                                sectionsMap.set(sectionId, {
                                    id: item.section.id,
                                    name: item.section.name,
                                    category: item.section.category,
                                    landingPriority: item.section.landingPriority,
                                    itemsCount: 0,
                                    items: []
                                });
                            }

                            // Check if tileSize object already exists
                            const existingTileSizeObj = sectionsMap.get(sectionId).items.find(obj => obj.tileSize === item.tileSize);
                            if (!existingTileSizeObj) {
                                // Create a new tileSize object if not found
                                sectionsMap.get(sectionId).items.push({
                                    tileSize: item.tileSize,
                                    list: [item]
                                });

                                ++sectionsMap.get(sectionId).itemsCount
                            } else {
                                // Push the item to the existing tileSize object's list
                                existingTileSizeObj.list.push(item);
                                ++sectionsMap.get(sectionId).itemsCount
                            }
                        });

                        // Convert map values to array
                        const sectionsWithItems = Array.from(sectionsMap.values());

                        return sectionsWithItems;
                    }

                    const cachedDataParsed = JSON.parse(cachedData);
                    const sectionsWithItems = convertToSectionsWithItems(cachedDataParsed.shop);

                    setSections(sectionsWithItems)
                    setShop(sectionsWithItems);
                    setLoading(false);
                    setRefreshing(false);
                })


        } catch (error) {
            console.error('Error fetching data:', error);
            setRefreshing(false); // Set refreshing to false if there's an error
        }
    }, [])

    useEffect(() => {
        fetchData();
    }, [i18next.language]);

    function loadShop({ item, index }) {

        return (
            <View key={index} style={{
                marginBottom: 15,
            }}>
                <View style={{
                    paddingHorizontal: 10,
                    width: 'auto',
                    flexDirection: "row",
                    marginBottom: 5
                }}>
                    <Text style={{ color: "white", fontFamily: "BurbankBigCondensed-Black", fontSize: 20, marginRight: 10 }}>{item.name.toUpperCase()}</Text>
                    <View style={{
                        backgroundColor: "#009BFF",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 7,
                        borderRadius: 5
                    }}>
                        <Text style={{ color: "white", fontFamily: "BurbankBigCondensed-Black", fontSize: 15 }}>{item.itemsCount} ITEMS</Text>
                    </View>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 10 }}>
                    {item.items.map((ratio, index) => (
                        <View key={index} style={{ flexDirection: 'row' }}>
                            {
                                ratio.tileSize === "Size_1_x_1" ? (
                                    <View style={{ flexDirection: 'row' }}>
                                        {[...Array(Math.ceil(ratio.list.length / 2))].map((_, colIndex) => (
                                            <View key={colIndex} style={{ flexDirection: 'column' }}>
                                                {/* Map through the items in each column */}
                                                {ratio.list.slice(colIndex * 2, colIndex * 2 + 2).map((offer, rowIndex) => (
                                                    <View key={`${colIndex}-${rowIndex}`} style={{
                                                        borderRadius: 5,
                                                        marginRight: 10,
                                                        marginBottom: rowIndex === 0 ? 5 : 0, // Add margin bottom for the first item in each column
                                                        width: 62,
                                                        height: 62,
                                                        overflow: 'hidden',
                                                        backgroundColor: '#191919',
                                                    }}>
                                                        <AutoScrollingScrollView
                                                            width={62}
                                                            height={62}
                                                            images={offer.displayAssets.map(e => e.background + "?width=500")}
                                                        />

                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: "row" }}>
                                        {ratio.list.map((offer, rowIndex) => (
                                            <RNGHTouchableOpacity key={rowIndex} onPress={() => navigation.navigate("DetailsScreen", { data: offer.granted[0] })}>
                                                <View style={{
                                                    borderRadius: 5,
                                                    marginRight: 10,
                                                    width: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 130 : offer.tileSize === "Size_1_x_2" ? 62 : 150,
                                                    height: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 130 : offer.tileSize === "Size_2_x_2" ? 130 : offer.tileSize === "Size_1_x_2" ? 130 : 150,
                                                    overflow: 'hidden',
                                                    backgroundColor: '#191919',
                                                }}>
                                                    <AutoScrollingScrollView
                                                        width={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 130 : offer.tileSize === "Size_1_x_2" ? 62 : 150}
                                                        height={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 130 : offer.tileSize === "Size_2_x_2" ? 130 : offer.tileSize === "Size_1_x_2" ? 130 : 150}
                                                        images={offer.displayAssets.map(e => e.background + "?width=500")}
                                                    />
                                                </View>
                                            </RNGHTouchableOpacity>
                                        ))}
                                    </View>
                                )

                            }
                        </View>
                    ))}
                </ScrollView>
            </View>
        )
    }

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                <View style={{
                    flexDirection: 'row',
                    marginTop: 50,
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>

                    <TouchableOpacity style={{
                        flexDirection: 'row',
                    }}>
                        <Image source={{ uri: 'https://cdn2.unrealengine.com/fortnite-zeus-icon-200x200-60318da67e43.png' }} style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }} />

                        <View style={{
                            flexDirection: 'column',
                            marginLeft: 20,
                        }}>
                            <Text style={{ color: 'white' }}>{t("good_morning")}</Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                                color: 'white'
                            }}>OHY_</Text>
                        </View>
                    </TouchableOpacity>
                    <Octicons name="three-bars" size={30} color="white" />

                </View>

                {/* <ScrollView horizontal={true} directionalLockEnabled={true} bounces={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 40,
                        marginBottom: 20
                    }}>
                        {section.map((section, index) => (

                            <TouchableOpacity
                                key={index}
                                style={{
                                    marginRight: 5,
                                    width: 'auto',
                                    borderRadius: 5,
                                    height: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: 15,
                                    backgroundColor: '#191919',
                                    borderRadius: 5,
                                }}
                            >
                                <Text style={{
                                    color: 'white',
                                    fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                }}>{section.name.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView> */}

            </View>

            <FlatList
                data={shop}
                renderItem={loadShop}
            />
        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});