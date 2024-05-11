import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

export default function Details({ navigation }) {

    const { t } = useTranslation()
    let cachedLanguage = i18next.language;
    const route = useRoute();
    const receivedData = route.params?.data;

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>
            
            <View style={{
                width: '90%',
                position: "absolute",
            }}>

                <Text style={{
                    color: "white",
                    fontSize: 75,
                    maxWidth: "90%",
                    fontWeight: "700",
                    fontFamily: "GeneralSans-Variable",
                }}>Get Started</Text>
                <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={{
                    backgroundColor: "#00FF97",
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: "center",
                    padding: 10,
                    borderRadius: 5
                }}>

                    <Text style={{
                        fontSize: 21,
                        fontFamily: "GeneralSans-Variable",
                        color: "white"
                    }}>login</Text>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("CreateAccountScreen")} style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: "center",
                    padding: 5,
                    borderRadius: 5,
                    flexDirection: "row"
                }}>

                    <Text style={{
                        fontSize: 15,
                        color: "#fff"
                    }}>don't have an account ?</Text>
                    <Text style={{
                        fontSize: 15,
                        color: "#1573FE"
                    }}> sign up now!</Text>

                </TouchableOpacity>
            </View>
        </LinearGradient>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
});
