import React, { useEffect, useRef, useState, useContext } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Dimensions } from 'react-native';
import BottomSheet from '../helpers/BottomSheet';
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import MapView, { UrlTile, Marker, Callout } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { FlatList, TextInput } from 'react-native-gesture-handler';

export default function Settings({ navigation }) {
    const { t } = useTranslation()

    const settings = [
        {
            name: t("profile"),
            icon: <MaterialIcons name="account-circle" size={30} color="white" />,
            description: t("profile_desc"),
            screen: "profile"
        },
        {
            name: t("appearance"),
            icon: <MaterialIcons name="dashboard-customize" size={30} color="white" />,
            description: t("appearance_desc"),
            screen: "appearance"
        },
        {
            name: t("notification"),
            icon: <Ionicons name="notifications-sharp" size={30} color="white" />,
            description: t("notification_desc"),
            screen: "appearance"
        },
        {
            name: t("egs"),
            icon: <Image source={require('../../assets/logos/epic.png')} style={{ width: 30, height: 30 }} />,
            description: t("egs_desc"),
            screen: "appearance"
        },
    ]

    function listSettingOptions({ item }) {

        return (
            <TouchableOpacity onPress={() => navigation.navigate(item.screen)} style={{
                paddingVertical: 10,
                marginTop: 10,
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginLeft: 10,
                    marginRight: 10
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10
                    }}>
                        {item.icon}
                        <View style={{
                            marginLeft: 20,
                            maxWidth: "77%",
                        }}>
                            <Text style={{
                                color: "white",
                                fontSize: 18
                            }}>{item.name}</Text>
                            <Text style={{
                                color: "white",
                                opacity: 0.5,
                                fontSize: 12
                            }}>{item.description}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>

            <View style={{ width: "90%" }}>
                <FlatList
                    data={settings}
                    renderItem={listSettingOptions}
                />
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
