import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Octicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import * as FileSystem from 'expo-file-system';

export default function Home() {

    const CACHE_FILE_URI = `${FileSystem.documentDirectory}cached_data.json`;
    const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

    const [searchText, setSearchText] = useState('');
    const [cosmetics, setCosmetics] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

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
                        // Check if cached data is expired
                        if (currentTime - i.modificationTime < CACHE_EXPIRATION_TIME) {
                            // If not expired, read cached data
                            cachedData = await FileSystem.readAsStringAsync(CACHE_FILE_URI);
                        }
                    }

                    if (!cachedData) {
                        // Fetch data from API if no cached data or expired
                        const response = await fetch('https://fortniteapi.io/v2/items/list?lang=en', {
                            headers: {
                                'Authorization': 'd4ce1562-839ff66b-3946ccb6-438eb9cf'
                            }
                        });
                        const jsonData = await response.json();
                        // Save fetched data to cache
                        await FileSystem.writeAsStringAsync(CACHE_FILE_URI, JSON.stringify(jsonData.items), { encoding: FileSystem.EncodingType.UTF8 });
                        cachedData = JSON.stringify(jsonData.items);
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

    const renderCosmeticItem = ({ item }) => (
        <View style={{ width: 100, height: 100, marginHorizontal: 5 }}>
            <Image
                source={{ uri: item.images.icon }}
                style={{ width: '100%', height: '100%', position: 'absolute' }}
                resizeMode="contain"
            />
            <Image
                source={require(`../../assets/cosmetics/common.png`)}
                style={{ width: '100%', height: '100%', position: 'absolute' }}
                resizeMode="contain"
            />
        </View>
    );

    const onRefresh = () => {
        setRefreshing(true); // Set refreshing to true when refreshing starts
        // Clear cache and fetch fresh data
        FileSystem.deleteAsync(CACHE_FILE_URI).then(fetchData);
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 60,
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>

                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <Image source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Ash' }} style={{
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
                    height: 40,
                    backgroundColor: '#1d1f24',
                    borderRadius: 5,
                }}>

                    <TextInput
                        placeholderTextColor={"white"}
                        placeholder="Search"
                        selectionColor={"white"}
                        cursorColor={"white"}
                        style={{
                            marginLeft: 10,
                            height: 40,
                            backgroundColor: '#1d1f24',
                            borderRadius: 5,
                            color: 'white'
                        }} />

                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={cosmetics}
                    renderItem={renderCosmeticItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    onEndReachedThreshold={0.1}
                    onEndReached={loadMoreItems}
                    ListFooterComponent={() => loading && <ActivityIndicator size="large" color="#0000ff" />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ marginTop: 10 }} />
                    }
                />

            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
});
