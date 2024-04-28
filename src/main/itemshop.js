import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import axios from 'axios'
import { TouchableOpacity as RNGHTouchableOpacity, ScrollView, FlatList } from 'react-native-gesture-handler';
import AutoScrollingScrollView from '../helpers/imageSlider';

export default function Shop({ navigation }) {
    const { t } = useTranslation()
    let cachedLanguage = i18next.language;

    const types = [
        {
            name: t("all")
        },
        {
            id: "BattleRoyale",
            name: t("battle_royale")
        },
        {
            id: "Juno",
            name: t("juno")
        },
        {
            id: "sparks_song",
            name: t("fetival")
        },
        {
            id: "DelMar",
            name: t("delmar")
        },
    ]

    const CACHE_FILE_URI = `${FileSystem.documentDirectory}shop_cached_data.json`;
    const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

    const [loading, setLoading] = useState(true)
    const [shop, setShop] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [selected, setSelected] = useState(0);
    const [searchedShop, setSearchedShop] = useState([])

    // const filterShop = useCallback(() => {

    //     let filteredShop = shop;
    //     if(selected === 1){
    //         filteredShop = filteredShop.filter(section => {
    //             // Check if the section has tiles
    //             if (section.tiles) {
    //                 // Filter through each tile
    //                 section.tiles = section.tiles.filter(tile => {
    //                     // Check if the tile has a list
    //                     if (tile.list > 0) {
    //                         // Filter through each item in the list
    //                         tile.list = tile.list.filter(item => {
    //                             // Check if the mainType is sparks_song
    //                             if (item.mainType === "sparks_song") {
    //                                 return false; // Remove item
    //                             } else {
    //                                 // Check if displayAssets has BattleRoyale as primaryMode
    //                                 const hasBattleRoyale = item.displayAssets.some(asset => asset.primaryMode === "BattleRoyale");
    //                                 return hasBattleRoyale; // Keep item if BattleRoyale exists
    //                             }
    //                         });

    //                         // Remove the tile if its list is empty
    //                         return tile.list.length > 0;
    //                     } else {
    //                         return false; // Remove tile if it has no list
    //                     }
    //                 });

    //                 // Remove the section if its tiles are empty
    //                 console.log(section.tiles.length > 0)
    //                 return section.tiles.length > 0;
    //             } else {
    //                 return false; // Remove section if it has no tiles
    //             }
    //         });
    //     }
    //     else if(selected === 2){
    //         filteredShop = filteredShop.filter(section => {
    //             // Check if the section has tiles
    //             if (section.tiles) {
    //                 // Filter through each tile
    //                 section.tiles = section.tiles.filter(tile => {
    //                     // Check if the tile has a list
    //                     if (tile.list) {
    //                         // Filter through each item in the list
    //                         tile.list = tile.list.filter(item => {
    //                             // Check if the mainType is sparks_song
    //                             if (item.mainType === "sparks_song") {
    //                                 return false; // Remove item
    //                             } else {
    //                                 // Check if displayAssets has BattleRoyale as primaryMode
    //                                 const hasBattleRoyale = item.displayAssets.some(asset => asset.primaryMode === "Juno");
    //                                 return hasBattleRoyale; // Keep item if BattleRoyale exists
    //                             }
    //                         });

    //                         // Remove the tile if its list is empty
    //                         return tile.list.length > 0;
    //                     } else {
    //                         return false; // Remove tile if it has no list
    //                     }
    //                 });

    //                 // Remove the section if its tiles are empty
    //                 return section.tiles.length > 0;
    //             } else {
    //                 return false; // Remove section if it has no tiles
    //             }
    //         });
    //     }
    //     else if(selected === 4){
    //         filteredShop = filteredShop.filter(section => {
    //             // Check if the section has tiles
    //             if (section.tiles) {
    //                 // Filter through each tile
    //                 section.tiles = section.tiles.filter(tile => {
    //                     // Check if the tile has a list
    //                     if (tile.list) {
    //                         // Filter through each item in the list
    //                         tile.list = tile.list.filter(item => {
    //                             // Check if the mainType is sparks_song
    //                             if (item.mainType !== "sparks_song") {
    //                                 return false; // Remove item
    //                             }
    //                         });

    //                         // Remove the tile if its list is empty
    //                         return tile.list.length > 0;
    //                     } else {
    //                         return false; // Remove tile if it has no list
    //                     }
    //                 });

    //                 // Remove the section if its tiles are empty
    //                 return section.tiles.length > 0;
    //             } else {
    //                 return false; // Remove section if it has no tiles
    //             }
    //         });
    //     }
    //     else if(selected === 4){
    //         filteredShop = filteredShop.filter(section => {
    //             // Check if the section has tiles
    //             if (section.tiles) {
    //                 // Filter through each tile
    //                 section.tiles = section.tiles.filter(tile => {
    //                     // Check if the tile has a list
    //                     if (tile.list) {
    //                         // Filter through each item in the list
    //                         tile.list = tile.list.filter(item => {
    //                             // Check if the mainType is sparks_song
    //                             if (item.mainType === "sparks_song") {
    //                                 return false; // Remove item
    //                             } else {
    //                                 // Check if displayAssets has BattleRoyale as primaryMode
    //                                 const hasBattleRoyale = item.displayAssets.some(asset => asset.primaryMode === "DelMar");
    //                                 return hasBattleRoyale; // Keep item if BattleRoyale exists
    //                             }
    //                         });

    //                         // Remove the tile if its list is empty
    //                         return tile.list.length > 0;
    //                     } else {
    //                         return false; // Remove tile if it has no list
    //                     }
    //                 });

    //                 // Remove the section if its tiles are empty
    //                 return section.tiles.length > 0;
    //             } else {
    //                 return false; // Remove section if it has no tiles
    //             }
    //         });
    //     }
    //     else filteredShop = shop

    //     setSearchedShop(filteredShop);

    // }, [shop, selected]);

    // useEffect(() => {
    //     filterShop();
    // }, [filterShop]);

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

                    if (!cachedData || i18next.language !== cachedLanguage || true) {

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
                                    tiles: []
                                });
                            }

                            // Check if tileSize object already exists
                            const existingTileSizeObj = sectionsMap.get(sectionId).tiles.find(obj => obj.tileSize === item.tileSize);
                            if (!existingTileSizeObj) {
                                // Create a new tileSize object if not found
                                sectionsMap.get(sectionId).tiles.push({
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

    const loadShop = useCallback(({ item, index }) => {

        return (
            <View style={{ marginBottom: 15 }}>
                <View style={{ paddingHorizontal: 20, flexDirection: "row", marginBottom: 5 }}>
                    <Text style={{ color: "white", fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankBigCondensed-Black", fontSize: 20, marginRight: 5 }}>{item.name.toUpperCase()}</Text>
                    <View style={{ backgroundColor: "#009BFF", justifyContent: "center", alignItems: "center", paddingHorizontal: 5, borderRadius: 5 }}>
                        <Text style={{ color: "white", fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankBigCondensed-Black", fontSize: 15 }}>{item.itemsCount} {item.itemsCount > 1 ? t("items").toUpperCase() : t("item").toUpperCase()}</Text>
                    </View>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 20 }}
                    data={item.tiles}
                    onEndReachedThreshold={0.1}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={5000}
                    initialNumToRender={25}
                    windowSize={2}
                    keyExtractor={(item, index) => `${index}`} // Change the key to something unique for each item
                    renderItem={({ item: ratio }) => (
                        <View style={{ flexDirection: ratio.tileSize === "Size_1_x_1" ? 'row' : 'column' }}>
                            {ratio.tileSize === "Size_1_x_1" ? (
                                [...Array(Math.ceil(ratio.list.length / 2))].map((_, colIndex) => (
                                    <View key={colIndex} style={{ flexDirection: 'column' }}>
                                        {ratio.list.slice(colIndex * 2, colIndex * 2 + 2).map((offer, rowIndex) => (
                                            <RNGHTouchableOpacity onPress={() => navigation.navigate("DetailsScreen", { data: offer.granted[0] })} key={`${colIndex}-${rowIndex}`} style={{ marginRight: 5, marginBottom: rowIndex === 0 ? 5 : 0, width: 72, height: 72, overflow: 'hidden', backgroundColor: '#191919', position: "relative" }}>

                                                <AutoScrollingScrollView
                                                    width={72}
                                                    height={72}
                                                    images={offer.displayAssets.map(e => e.background + "?width=100")}
                                                />
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: 30, // Adjust the height of the shadow as needed
                                                    }}
                                                />
                                                <Text style={{
                                                    fontSize: 10,
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: 13,
                                                    left: 3,
                                                    fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black"
                                                }}>{offer.displayName.toUpperCase()}</Text>
                                                <Image style={{
                                                    position: "absolute",
                                                    bottom: 3,
                                                    left: 3,
                                                    width: 11,
                                                    height: 11
                                                }} source={require("../../assets/cosmetics/others/vbucks.png")} />
                                                <Text style={{
                                                    fontSize: 9,
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: 3,
                                                    left: 14,
                                                    fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black"
                                                }}>{offer.price.finalPrice}</Text>
                                            </RNGHTouchableOpacity>
                                        ))}
                                    </View>
                                ))
                            ) : (
                                <View style={{ flexDirection: "row" }}>
                                    {
                                        ratio.list.map((offer, rowIndex) => (
                                            <RNGHTouchableOpacity key={rowIndex} onPress={() => navigation.navigate("DetailsScreen", { data: offer.granted[0] })} style={{ marginRight: 5, width: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 170 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 82 : 150, height: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 150 : 150, overflow: 'hidden', backgroundColor: '#191919', position: "relative" }}>
                                                <AutoScrollingScrollView
                                                    width={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 170 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 82 : 150}
                                                    height={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 150 : 150}
                                                    images={offer.displayAssets.map(e => e.background + "?width=265")}
                                                />
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        left: 0,
                                                        right: 0,
                                                        height: 75, // Adjust the height of the shadow as needed
                                                    }}
                                                />
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: 15,
                                                    left: 3,
                                                    fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black"
                                                }}>{offer.displayName.toUpperCase()}</Text>
                                                <Image style={{
                                                    position: "absolute",
                                                    bottom: 3,
                                                    left: 3,
                                                    width: 12,
                                                    height: 12
                                                }} source={require("../../assets/cosmetics/others/vbucks.png")} />
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: 2,
                                                    left: 15,
                                                    fontFamily: "BurbankSmall-Black"
                                                }}>{offer.price.finalPrice}</Text>
                                            </RNGHTouchableOpacity>
                                        ))
                                    }
                                </View>
                            )}
                        </View>
                    )}
                />
            </View>
        );
    }, [])

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

                <ScrollView horizontal={true} directionalLockEnabled={true} bounces={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 40,
                        marginBottom: 20
                    }}>
                        {types.map((type, index) => (

                            <TouchableOpacity
                                onPress={() => setSelected(index)}
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
                                    color: selected === index ? colors.app.secondray : 'white',
                                    fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                }}>{type.name.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <FlatList
                    onEndReachedThreshold={0.1}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={20}
                    updateCellsBatchingPeriod={5000}
                    initialNumToRender={50}
                    windowSize={15}
                    data={shop}
                    renderItem={loadShop}
                />

            </View>


        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});