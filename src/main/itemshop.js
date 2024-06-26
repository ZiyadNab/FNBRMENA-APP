import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
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
import Timer from '../helpers/shoptimer';
import Color from 'color'
import useColorStore from '../helpers/colorsContext';

export default function Shop({ navigation }) {
    const { t } = useTranslation()
    let cachedLanguage = i18next.language;
    const secondrayColor = useColorStore(res => res.jsonData.app.secondray);
    const backgroundColorLR = useColorStore(res => res.jsonData.app.background);
    const primaryColorLR = useColorStore(res => res.jsonData.app.primary);

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
    const [searchedShop, setSearchedShop] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [selected, setSelected] = useState(0);
    const [bookmarks, setBookmarks] = useState([
        "AA_AcresFarm_Bundle",
        "Character_Headset",
        "Character_RollerBlade"
    ])

    const filterShop = useCallback(() => {

        let filteredShop = JSON.parse(JSON.stringify(shop));

        if (selected === 1) {
            filteredShop = filteredShop.filter(section => {
                // Check if the section has tiles
                if (section.tiles) {
                    // Filter through each tile
                    section.tiles = section.tiles.filter(tile => {
                        // Check if the tile has a list
                        if (tile.list.length > 0) {

                            // Filter through each item in the list
                            tile.list = tile.list.filter(item => {
                                // Check if the mainType is sparks_song
                                if (item.mainType === "sparks_song") {
                                    return false; // Remove item
                                } else {

                                    // Check if displayAssets has BattleRoyale as primaryMode
                                    item.displayAssets = item.displayAssets.filter(asset => asset.primaryMode === "BattleRoyale");

                                    // Remove the item if displayAssets is empty after filtering
                                    return item.displayAssets.length > 0;
                                }
                            });

                            // Remove the tile if its list is empty
                            return tile.list.length > 0;
                        } else {
                            return false; // Remove tile if it has no list
                        }
                    });

                    // Remove the section if its tiles are empty
                    return section.tiles.length > 0;
                } else {
                    return false; // Remove section if it has no tiles
                }
            });
        }
        else if (selected === 2) {
            filteredShop = filteredShop.filter(section => {
                // Check if the section has tiles
                if (section.tiles) {
                    // Filter through each tile
                    section.tiles = section.tiles.filter(tile => {
                        // Check if the tile has a list
                        if (tile.list) {
                            // Filter through each item in the list
                            tile.list = tile.list.filter(item => {
                                // Check if the mainType is sparks_song
                                if (item.mainType === "sparks_song") {
                                    return false; // Remove item
                                } else {
                                    // Check if displayAssets has Juno as primaryMode
                                    item.displayAssets = item.displayAssets.filter(asset => asset.primaryMode === "Juno");

                                    // Remove the item if displayAssets is empty after filtering
                                    return item.displayAssets.length > 0;
                                }
                            });

                            // Remove the tile if its list is empty
                            return tile.list.length > 0;
                        } else {
                            return false; // Remove tile if it has no list
                        }
                    });

                    // Remove the section if its tiles are empty
                    return section.tiles.length > 0;
                } else {
                    return false; // Remove section if it has no tiles
                }
            });
        }
        else if (selected === 3) {
            filteredShop = filteredShop.filter(section => {
                // Check if the section has tiles
                if (section.tiles) {
                    // Filter through each tile
                    section.tiles = section.tiles.filter(tile => {
                        // Check if the tile has a list
                        if (tile.list) {
                            // Filter through each item in the list
                            tile.list = tile.list.filter(item => {
                                // Check if the mainType is sparks_song
                                if (item.mainType === "sparks_song") {
                                    return true; // Remove item
                                } else return false;
                            });

                            // Remove the tile if its list is empty
                            return tile.list.length > 0;
                        } else {
                            return false; // Remove tile if it has no list
                        }
                    });

                    // Remove the section if its tiles are empty
                    return section.tiles.length > 0;
                } else {
                    return false; // Remove section if it has no tiles
                }
            });
        }
        else if (selected === 4) {
            filteredShop = filteredShop.filter(section => {
                // Check if the section has tiles
                if (section.tiles) {
                    // Filter through each tile
                    section.tiles = section.tiles.filter(tile => {
                        // Check if the tile has a list
                        if (tile.list) {
                            // Filter through each item in the list
                            tile.list = tile.list.filter(item => {
                                // Check if the mainType is sparks_song
                                if (item.mainType === "sparks_song") {
                                    return false; // Remove item
                                } else {

                                    // Check if displayAssets has DelMar as primaryMode
                                    item.displayAssets = item.displayAssets.filter(asset => asset.primaryMode === "DelMar");

                                    // Remove the item if displayAssets is empty after filtering
                                    return item.displayAssets.length > 0;
                                }
                            });

                            // Remove the tile if its list is empty
                            return tile.list.length > 0;
                        } else {
                            return false; // Remove tile if it has no list
                        }
                    });

                    // Remove the section if its tiles are empty
                    return section.tiles.length > 0;
                } else {
                    return false; // Remove section if it has no tiles
                }
            });
        }

        setSearchedShop(filteredShop);

    }, [shop, selected]);

    useEffect(() => {
        filterShop();
    }, [filterShop]);

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

    function convertToSectionsWithItems(data) {
        const sectionsMap = new Map();

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

            const section = sectionsMap.get(sectionId);
            const existingTileSizeObj = section.tiles.find(obj => obj.tileSize === item.tileSize);
            if (!existingTileSizeObj) {
                section.tiles.push({
                    tileSize: item.tileSize,
                    list: [item]
                });
                section.itemsCount += 1;
            } else {
                existingTileSizeObj.list.push(item);
                section.itemsCount += 1;
            }
        });

        return Array.from(sectionsMap.values());
    }

    const loadShop = useCallback(({ item, index }) => {

        return (
            <View style={{ marginBottom: 15 }}>
                <View style={{ paddingLeft: 20, flexDirection: "row", alignItems: "center", marginBottom: 5, paddingRight: 10 }}>
                    <Text style={{ color: "white", fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankBigCondensed-Black", fontSize: 20, marginRight: 5 }}>{item.name.toUpperCase()}</Text>
                    <View style={{ backgroundColor: "red", justifyContent: "center", alignItems: "center", paddingHorizontal: 5, borderRadius: 5, height: 18, flexDirection: "row" }}>
                        {/* <Text style={{ color: "white", fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankBigCondensed-Black", fontSize: 15 }}>{item.itemsCount} {item.itemsCount > 1 ? t("items").toUpperCase() : t("item").toUpperCase()}</Text> */}
                        <Image source={require("../../assets/shop/timer.png")} style={{
                            width: 15,
                            height: 15,
                            marginRight: 3
                        }} />
                        <Timer targetDate={item.tiles[0].list[0].offerDates.out} style={{
                            fontSize: 10,
                            color: "white",
                            fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                        }} />
                    </View>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 20, flexGrow: 1 }}
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
                                            <RNGHTouchableOpacity onPress={() => {
                                                if (offer.granted.length > 0) navigation.navigate("DetailsScreen", { data: offer.granted[0] })
                                            }} key={`${colIndex}-${rowIndex}`} style={{ borderRadius: 2, marginRight: 5, marginBottom: rowIndex === 0 ? 5 : 0, width: 72, height: 72, overflow: 'hidden', backgroundColor: '#191919', position: "relative" }}>

                                                <AutoScrollingScrollView
                                                    width={72}
                                                    height={72}
                                                    images={offer.displayAssets.length > 0 ? offer.displayAssets.map(e => e.background + "?width=156") : ["https://i.ibb.co/XCDwKHh/HVH5sqV.png"]}
                                                    placeholder={offer.displayAssets.length === 0}
                                                />
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        left: -2,
                                                        right: -2,
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
                                                {
                                                    bookmarks.includes(offer.mainId) ? (
                                                        <Image style={{
                                                            width: 15,
                                                            height: 15,
                                                            top: 0,
                                                            right: 4,
                                                            position: "absolute",
                                                        }} source={require('../../assets/shop/bookmark.png')} />
                                                    ) : null
                                                }
                                                {
                                                    offer.banner ? (
                                                        <View style={{
                                                            backgroundColor: offer.banner.id === "New" ? "#eff727" : "#fff",
                                                            borderRadius: 3,
                                                            padding: 2,
                                                            top: 2,
                                                            left: 2,
                                                            position: "absolute",
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 5,
                                                                fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black"
                                                            }}>{offer.banner.name.toUpperCase()}</Text>
                                                        </View>
                                                    ) : null
                                                }
                                                {/* {
                                                    offer.offerDates ? (
                                                        <View style={{
                                                            backgroundColor: "#fff",
                                                            borderRadius: 3,
                                                            padding: 2,
                                                            top: 2,
                                                            left: 2,
                                                            position: "absolute",
                                                        }}>
                                                            <Timer targetDate={offer.offerDates.out} style={{
                                                                fontSize: 5,
                                                                fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black"
                                                            }} />
                                                        </View>
                                                    ) : null
                                                } */}
                                            </RNGHTouchableOpacity>
                                        ))}
                                    </View>
                                ))
                            ) : (
                                <View style={{ flexDirection: "row" }}>
                                    {
                                        ratio.list.map((offer, rowIndex) => (
                                            <RNGHTouchableOpacity key={rowIndex} onPress={() => {
                                                if (offer.granted.length > 0) navigation.navigate("DetailsScreen", { data: offer.granted[0] })
                                            }} style={{ borderRadius: 2, marginRight: 5, width: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 170 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 82 : 150, height: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 150 : 150, overflow: 'hidden', backgroundColor: '#191919', position: "relative" }}>
                                                <AutoScrollingScrollView
                                                    width={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 170 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 82 : 150}
                                                    height={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 150 : 150}
                                                    images={offer.displayAssets.length > 0 ? offer.displayAssets.map(e => e.background + "?width=256") : ["https://i.ibb.co/XCDwKHh/HVH5sqV.png"]}
                                                    placeholder={offer.displayAssets.length === 0}
                                                />
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        left: -2,
                                                        right: -2,
                                                        height: 75, // Adjust the height of the shadow as needed
                                                    }}
                                                />
                                                {/* <View style={{
                                                    backgroundColor: "#fff",
                                                    borderRadius: 3,
                                                    padding: 2,
                                                    position: "absolute",
                                                    bottom: 30,
                                                    left: 3,
                                                }}>
                                                    <Timer targetDate={offer.offerDates.out} style={{
                                                        fontSize: 5,
                                                        color: "black",
                                                        fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                                    }} />
                                                </View> */}
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: 15,
                                                    left: 3,
                                                    fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black"
                                                }}>{offer.displayName !== "" ? offer.displayName.toUpperCase() : t("updates_soon").toUpperCase()}</Text>
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
                                                {
                                                    bookmarks.includes(offer.mainId) ? (
                                                        <Image style={{
                                                            width: 15,
                                                            height: 15,
                                                            top: 0,
                                                            right: 4,
                                                            position: "absolute",
                                                        }} source={require('../../assets/shop/bookmark.png')} />
                                                    ) : null
                                                }
                                                {
                                                    offer.banner ? (
                                                        <View style={{
                                                            backgroundColor: offer.banner.id === "New" ? "#eff727" : "#fff",
                                                            borderRadius: 3,
                                                            padding: 2,
                                                            top: 3,
                                                            left: 3,
                                                            position: "absolute",
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 5,
                                                                fontFamily: cachedLanguage === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black"
                                                            }}>{offer.banner.name.toUpperCase()}</Text>
                                                        </View>
                                                    ) : null
                                                }
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

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await FileSystem.getInfoAsync(CACHE_FILE_URI)
            .then(i => {
                if (i.exists) FileSystem.deleteAsync(CACHE_FILE_URI).then(fetchData);
                else fetchData()
            })

    }, [])

    return (
        <LinearGradient colors={[backgroundColorLR, "#000"]} style={styles.container}>
            <View style={{
                justifyContent: 'center',
                marginTop: 20,
            }}>

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
                                    backgroundColor: selected === index ? Color(secondrayColor).alpha(0.20).rgb().string() : primaryColorLR,
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
                    contentContainerStyle={{ paddingBottom: 100 }}
                    data={loading ? [] : searchedShop}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    initialNumToRender={5}
                    windowSize={10}
                    renderItem={loadShop}
                    ListFooterComponent={() => { return loading ? <ActivityIndicator size="large" color="#1473FC" /> : null }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ marginTop: 5 }} />
                    }
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