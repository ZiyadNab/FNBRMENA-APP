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

export default function Quests({ navigation }) {
    const { t } = useTranslation()
    let cachedLanguage = i18next.language;

    const CACHE_FILE_URI = `${FileSystem.documentDirectory}quests_cached_data.json`;
    const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

    const [loading, setLoading] = useState(true)
    const [quests, setQuests] = useState([])
    const [refreshing, setRefreshing] = useState(false)

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
                        const response = await axios(`https://fortniteapi.io/v3/challenges?lang=${i18next.language}&season=29`, {
                            headers: {
                                'Authorization': 'd4ce1562-839ff66b-3946ccb6-438eb9cf'
                            }
                        })

                        const jsonData = await response.data;

                        // Save fetched data to cache
                        await FileSystem.writeAsStringAsync(CACHE_FILE_URI, JSON.stringify(jsonData.bundles), { encoding: FileSystem.EncodingType.UTF8 })
                        cachedData = JSON.stringify(jsonData.bundles);
                        cachedLanguage = i18next.language
                    }

                    setQuests(JSON.parse(cachedData));
                    setLoading(false);
                    setRefreshing(false);
                })


        } catch (error) {
            console.error('Error fetching data:', error);
            setRefreshing(false); // Set refreshing to false if there's an error
        }
    }, [])

    useEffect(() => {
        fetchData()
    })

    function loadQuestsBundles({ item, index }) {
        return (
            <RNGHTouchableOpacity onPress={() => navigation.navigate("QuestsBundleScreen", { data: item })} key={index} style={{
                marginBottom: 10,
                width: '99%',
                borderRadius: 5,
                overflow: 'hidden',
            }}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#191919',
                    overflow: 'hidden',
                    width: '100%',
                }}>
                    <LinearGradient colors={[item.colorData ? item.colorData.RGB1 : '#FFBD00', item.colorData ? item.colorData.RGB2 : '#FF7000']} style={{ width: 100 }}>
                        <Image style={{ width: 100, height: 100 }} source={{ uri: item.image }} />
                    </LinearGradient>
                    <View style={{
                        paddingHorizontal: 10,
                        width: '70%',
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontFamily: "BurbankBigCondensed-Black",
                            fontSize: 25,
                        }}>{item.name ? item.name.toUpperCase() : "NO NAME SPECIFIED!"}</Text>
                    </View>
                </View>
            </RNGHTouchableOpacity>
            
        )
    }

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10
            }}>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={quests}
                    renderItem={loadQuestsBundles}
                />

            </View>

        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});