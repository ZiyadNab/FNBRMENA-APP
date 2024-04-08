import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
    StyleSheet, Text, View, TextInput, FlatList, ActivityIndicator,
    RefreshControl, ScrollView, TouchableOpacity, Platform
} from 'react-native';
import { Octicons, AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import RenderImage from '../helpers/list'
import { Image } from 'expo-image';

export default function Home({ navigation }) {

    const cosmeticTypes = [
        {
            id: 'all',
            name: 'All',
        },
        {
            id: 'outfit',
            name: 'Outfit',
        },
        {
            id: 'pickaxe',
            name: 'Harvesting Tool',
        },
        {
            id: 'emote',
            name: 'Emote',
        },
        {
            id: 'glider',
            name: 'Glider',
        },
        {
            id: 'backpack',
            name: 'BackBling',
        },
        {
            id: 'pet',
            name: 'Pet',
        },
        {
            id: 'wrap',
            name: 'Wrap',
        },
        {
            id: 'toy',
            name: 'Toy',
        },
        {
            id: 'spray',
            name: 'Spray',
        },
        {
            id: 'music',
            name: 'Music',
        },
        {
            id: 'bannertoken',
            name: 'BANNER',
        },
        {
            id: 'cosmeticvariant',
            name: 'Style',
        },
        {
            id: 'loadingscreen',
            name: 'Loading Screen',
        },
        {
            id: 'emoji',
            name: 'Emoticon',
        },
        {
            id: 'contrail',
            name: 'Contrail',
        },
        {
            id: 'bundle',
            name: 'Item Bundle',
        },
    ]

    const CACHE_FILE_URI = `${FileSystem.documentDirectory}list_cached_data.json`;
    const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState(0);
    const [cosmetics, setCosmetics] = useState([])
    const [searchedCosmetics, setSearchedCosmetics] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const handleSearch = useCallback((text) => {
        setSearchText(text)
    }, []);

    const handleFilteredTypes = useCallback((index) => {
        setSelected(index);
    }, []);

    const filterCosmetics = useCallback(() => {
        let filteredCosmetics = cosmetics;
        if (selected === 0) {
            filteredCosmetics = filteredCosmetics.filter(item => item.name);
        }
        if (selected !== 0) {
            filteredCosmetics = filteredCosmetics.filter(item => item.type.id.toLowerCase().includes(cosmeticTypes[selected].id.toLowerCase()));
        }
        if (searchText) {
            filteredCosmetics = filteredCosmetics.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        setSearchedCosmetics(filteredCosmetics);
    }, [cosmetics, searchText, selected]);

    useEffect(() => {
        filterCosmetics();
    }, [filterCosmetics]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true); // Set loading to true while fetching data
            let cachedData = null;
            await FileSystem.getInfoAsync(CACHE_FILE_URI)
                .then(async i => {
                    if (i.exists) {
                        const currentTime = new Date().getTime();
                        const modificationTimeMilliseconds = i.modificationTime * 1000
                        // Check if cached data is expired
                        if (currentTime - modificationTimeMilliseconds < CACHE_EXPIRATION_TIME || true) {
                            // If not expired, read cached data
                            cachedData = await FileSystem.readAsStringAsync(CACHE_FILE_URI);
                        }
                    }

                    if (!cachedData) {
                        // Fetch data from API if no cached data or expired
                        const response = await axios('https://fortniteapi.io/v2/items/list?lang=en&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,apiTags,upcoming,releaseDate,lastAppearance,images,juno,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets', {
                            headers: {
                                'Authorization': 'd4ce1562-839ff66b-3946ccb6-438eb9cf'
                            }
                        })

                        const jsonData = await response.data;
                        // Save fetched data to cache
                        await FileSystem.writeAsStringAsync(CACHE_FILE_URI, JSON.stringify(jsonData.items), { encoding: FileSystem.EncodingType.UTF8 })
                        cachedData = JSON.stringify(jsonData.items);
                    }
// .reverse()
                    setCosmetics(JSON.parse(cachedData));
                    setLoading(false); // Set loading to false once data is present
                    setRefreshing(false); // Set refreshing to false after data is fetched
                })


        } catch (error) {
            console.error('Error fetching data:', error);
            setRefreshing(false); // Set refreshing to false if there's an error
        }
    }, [])

    const loadMoreItems = useCallback(() => {
        setCurrentPage(currentPage + 1);
    }, [])

    const onRefresh = useCallback(async () => {
        setRefreshing(true); // Set refreshing to true when refreshing starts
        // Clear cache and fetch fresh data
        await FileSystem.getInfoAsync(CACHE_FILE_URI)
            .then(i => {
                if (i.exists) FileSystem.deleteAsync(CACHE_FILE_URI).then(fetchData);
                else fetchData()
            })

    }, [])

    const getRarityPath = useCallback((rarity) => {
        const typeLower = rarity.toLowerCase();
        switch (typeLower) {
            case 'outfit':
                return require('../../assets/cosmetics/types/outfit.png');
            case 'pickaxe':
                return require('../../assets/cosmetics/types/harvesting_tool.png');
            case 'emote':
                return require('../../assets/cosmetics/types/emote.png');
            case 'glider':
                return require('../../assets/cosmetics/types/glider.png');
            case 'backpack':
                return require('../../assets/cosmetics/types/backbling.png');
            case 'pet':
                return require('../../assets/cosmetics/types/pet.png');
            case 'wrap':
                return require('../../assets/cosmetics/types/wrap.png');
            case 'toy':
                return require('../../assets/cosmetics/types/toy.png');
            case 'spray':
                return require('../../assets/cosmetics/types/spray.png');
            case 'music':
                return require('../../assets/cosmetics/types/music.png');
            case 'bannertoken':
                return require('../../assets/cosmetics/types/banner.png');
            case 'cosmeticvariant':
                return require('../../assets/cosmetics/types/style.png');
            case 'loadingscreen':
                return require('../../assets/cosmetics/types/loading_screen.png');
            case 'emoji':
                return require('../../assets/cosmetics/types/emoticon.png');
            case 'contrail':
                return require('../../assets/cosmetics/types/contrail.png');
            case 'bundle':
                return require('../../assets/cosmetics/types/item_bundle.png');
            default:
                return require('../../assets/cosmetics/types/unknown.png');
        }
    }, [])

    function handleTranslationYChange() {

    }

    return (
        <View style={styles.container}>
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

                    <TouchableOpacity onPress={() => navigation.navigate("DetailsScreen")} style={{
                        flexDirection: 'row',
                    }}>
                        <Image source={{ uri: 'https://cdn2.unrealengine.com/fortnite-medusa-icon-200x200-86c74fce36ff.png' }} style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }} />

                        <View style={{
                            flexDirection: 'column',
                            marginLeft: 20,
                        }}>
                            <Text style={{ color: 'white' }}>Good morning</Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                                color: 'white'
                            }}>OHY_</Text>
                        </View>
                    </TouchableOpacity>
                    <Octicons name="three-bars" size={30} color="white" />

                </View>

                <View style={{
                    width: '90%',
                    height: 40,
                    backgroundColor: '#1d1f24',
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>

                    <TextInput
                        value={searchText}
                        onChangeText={handleSearch}
                        placeholderTextColor={"white"}
                        placeholder="Search"
                        selectionColor={"white"}
                        cursorColor={"white"}
                        style={{
                            flex: 1,
                            height: 40,
                            backgroundColor: '#1d1f24',
                            borderRadius: 5,
                            color: 'white',
                            paddingLeft: 10,
                            marginRight: 10,
                        }} />

                    <TouchableOpacity style={{
                        height: 40,
                        padding: 10,
                        backgroundColor: '#1d1f24',
                        borderRadius: 5,
                    }}>
                        <AntDesign name="filter" color={"white"} size={20} />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal={true} directionalLockEnabled={true} bounces={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 40,
                        marginBottom: 20
                    }}>
                        {cosmeticTypes.map((type, index) => (

                            <TouchableOpacity
                                key={index}
                                onPress={() => handleFilteredTypes(index)}
                                style={{
                                    marginRight: 5,
                                    width: 'auto',
                                    borderRadius: 5,
                                    height: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: 15,
                                    backgroundColor: '#1d1f24',
                                    borderRadius: 5,
                                }}
                            >
                                {/* <Image cachePolicy='' source={getRarityPath(type.id)} style={{ width: 25, height: 25, tintColor: selected === index ? '#1473FC' : 'white', marginRight: 5 }} /> */}
                                <Text style={{
                                    color: selected === index ? '#1473FC' : 'white',
                                    fontWeight: 'bold',
                                }}>{type.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={searchedCosmetics}
                    renderItem={({ item }) => <RenderImage item={item} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    onEndReachedThreshold={0.1}
                    // onEndReached={loadMoreItems}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={20}
                    updateCellsBatchingPeriod={5000}
                    initialNumToRender={50}
                    windowSize={15}
                    ListFooterComponent={() => { return loading ? <ActivityIndicator size="large" color="#1473FC" /> : null }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ marginTop: 5 }} />
                    }
                />
            </View>

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
