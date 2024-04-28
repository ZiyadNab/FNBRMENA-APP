import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import colors from '../../colors.json'
import loadShop from '../helpers/loadShop';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler';

export default function Shop({ navigation }) {
    const { t } = useTranslation()
    let cachedLanguage = i18next.language;

    const types = [
        {
            name: "ALl"
        },
        {
            id: "BattleRoyale",
            name: "Battle Royale"
        },
        {
            id: "Juno",
            name: "LEGO® Fortnite"
        },
        {
            id: "sparks_song",
            name: "Festival"
        },
        {
            id: "DelMar",
            name: "Rocket Racing"
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

            </View>

            <FlatList
                onEndReachedThreshold={0.1}
                removeClippedSubviews={true}
                maxToRenderPerBatch={20}
                updateCellsBatchingPeriod={5000}
                initialNumToRender={50}
                windowSize={15}
                data={shop}
                renderItem={({ item, index }) => <loadShop item={item} index={index} navigation={navigation} />}
            />
        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});