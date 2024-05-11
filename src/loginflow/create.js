import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

export default function Create({ navigation }) {

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>
            
            <View style={{
                width: '90%',
            }}>
                
                <View style={{
                    
                }}/>
                <View/>

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});