import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
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

export default function Map({ navigation }) {

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>

            <WebView
                source={require('../../test.html')}
            />

        </LinearGradient>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
