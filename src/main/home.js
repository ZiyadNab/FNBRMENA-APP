import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, PureComponent } from 'react'
import {
    StyleSheet, Text, View, TextInput, FlatList, ActivityIndicator,
    RefreshControl, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { Octicons, AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'

class CosmeticItem extends PureComponent {
    render() {

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

        const { item } = this.props;
        return (
            <View style={{ width: 109, height: 109, margin: 5, borderRadius: 5 }}>
                <Image
                    source={getRarityPath(item.series ? item.series.value : item.rarity.value)}
                    style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
                    resizeMethod="contain"
                />
                <Image
                    source={{ uri: item.images.icon }}
                    onError={() => ({ uri: 'https://imgur.com/HVH5sqV.png' })}
                    style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
                    resizeMethod="contain"
                />
            </View>
        );
    }
}

export default function Home() {

    const cosmeticTypes = [
        'Outfit',
        'Harvesting Tool',
        'Emote',
        'Glider',
        'BackBling',
        'Pet',
        'Wrap',
        'Toy',
        'Spray',
        'Music',
        'BANNER',
        'Style',
        'Loading Screen',
        'Emoticon',
        'Contrail',
        'Item Bundle',
    ]

    const CACHE_FILE_URI = `${FileSystem.documentDirectory}cached_data.json`;
    const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState(-1);
    const [cosmetics, setCosmetics] = useState([])
    const [searchedCosmetics, setSearchedCosmetics] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const handleSearch = (text) => {
        setSearchText(text)
        const filteredCosmetics = cosmetics.filter(
            (item) =>
                item?.name?.toLowerCase().includes(text.toLowerCase())
        );

        setSearchedCosmetics(filteredCosmetics)
    };

    const handlePress = async (index) => {
        setSelected(index);
        sortedCosmetics
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true); // Set loading to true while fetching data
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

                    if (!cachedData) {
                        // Fetch data from API if no cached data or expired
                        const response = await axios('https://fortnite-api.com/v2/cosmetics/br', {
                            // headers: {
                            //     'Authorization': 'd4ce1562-839ff66b-3946ccb6-438eb9cf'
                            // }
                        })

                        const jsonData = await response.data;
                        // Save fetched data to cache
                        await FileSystem.writeAsStringAsync(CACHE_FILE_URI, JSON.stringify(jsonData.data), { encoding: FileSystem.EncodingType.UTF8 })
                        cachedData = JSON.stringify(jsonData.data);
                    }

                    setCosmetics(JSON.parse(cachedData));
                    setLoading(false); // Set loading to false once data is present
                    setRefreshing(false); // Set refreshing to false after data is fetched
                })


        } catch (error) {
            console.error('Error fetching data:', error);
            setRefreshing(false); // Set refreshing to false if there's an error
        }
    };

    const loadMoreItems = () => {
        setCurrentPage(currentPage + 1);
    };

    const onRefresh = () => {
        setRefreshing(true); // Set refreshing to true when refreshing starts
        // Clear cache and fetch fresh data
        FileSystem.deleteAsync(CACHE_FILE_URI).then(fetchData);
    };

    const getImagePath = (type) => {
        const typeLower = type.toLowerCase();
        switch (typeLower) {
            case 'outfit':
                return require('../../assets/cosmetics/types/outfit.png');
            case 'harvesting tool':
                return require('../../assets/cosmetics/types/harvesting_tool.png');
            case 'emote':
                return require('../../assets/cosmetics/types/emote.png');
            case 'glider':
                return require('../../assets/cosmetics/types/glider.png');
            case 'backbling':
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
            case 'banner':
                return require('../../assets/cosmetics/types/banner.png');
            case 'style':
                return require('../../assets/cosmetics/types/style.png');
            case 'loading screen':
                return require('../../assets/cosmetics/types/loading_screen.png');
            case 'emoticon':
                return require('../../assets/cosmetics/types/emoticon.png');
            case 'contrail':
                return require('../../assets/cosmetics/types/contrail.png');
            case 'item bundle':
                return require('../../assets/cosmetics/types/item_bundle.png');
            default:
                return require('../../assets/cosmetics/types/unknown.png');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 40,
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>

                    <View style={{
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
                    </View>
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
                            marginRight: 10, // Added marginRight for spacing
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

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 13, height: 60, marginBottom: 10 }}>
                    {cosmeticTypes.map((type, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handlePress(index)}
                            style={{
                                marginBottom: 10,
                                marginLeft: 5,
                                marginRight: 10,
                            }}
                        >
                            <View style={{
                                borderRadius: 5,
                                padding: 10,
                                backgroundColor: '#1d1f24',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Image source={getImagePath(type)} style={{ width: 25, height: 25, tintColor: selected === index ? '#1473FC' : 'white', marginRight: 5 }} />
                                <Text style={{
                                    color: selected === index ? '#1473FC' : 'white',
                                    fontWeight: 'bold',
                                }}>{type}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={searchedCosmetics.length ? searchedCosmetics : cosmetics}
                    renderItem={({ item }) => <CosmeticItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    onEndReachedThreshold={0.1}
                    onEndReached={loadMoreItems}
                    ListFooterComponent={() => { loading ? <ActivityIndicator size="large" color="#1473FC" /> : null }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ marginTop: 10 }} />
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
