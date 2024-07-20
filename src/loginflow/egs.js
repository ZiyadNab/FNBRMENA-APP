import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';
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
import useColorStore from '../helpers/colorsContext';
import TextInput from '../helpers/TextInput'
import Toast from 'react-native-toast-message'
import * as qs from 'querystring'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useEGSStore from '../helpers/useEGSStore';

export default function Map({ navigation }) {
    const secondrayColor = useColorStore(res => res.jsonData.app.secondray);
    const backgroundColorLR = useColorStore(res => res.jsonData.app.background);
    const primaryColorLR = useColorStore(res => res.jsonData.app.primary);
    const [tokenErrored, setTokenErrored] = useState(false)
    const [tokenSuccess, setTokenSuccess] = useState(false)
    const [EGSToken, setEGSToken] = useState('')
    const oauthToken = useEGSStore(res => res.oauthToken);
    const accountLinked = useEGSStore(res => res.isEpicGamesAccountLinked);

    const handleOpenURL = async () => {
        const url = 'https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code'; // Replace with your URL
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    };

    async function validateInputs() {

        // Validate token
        if (EGSToken.length === 0) {
            setTokenErrored(true)
            return Toast.show({
                type: 'info',
                text1: 'Something missing!',
                text2: 'Please fill in password.',
                visibilityTime: 5000,
                autoHide: true,

            })
        }

        // Input validation passed
        useEGSStore.getState().linkEpicGamesServices(EGSToken)
    }

    return (
        <LinearGradient colors={[backgroundColorLR, backgroundColorLR]} style={styles.container}>

            <View style={{
                marginHorizontal: 30,
                marginTop: 200
            }}>
                <TextInput errored={tokenErrored} success={tokenSuccess} placeholderTextColor={"white"} onChangeText={(val) => setEGSToken(val)} placeholder={"Enter your token"} updateValidation={() => {
                    setTokenErrored(false)
                    setTokenSuccess(false)
                }} />
                <TouchableOpacity disabled={accountLinked} onPress={validateInputs} style={{
                    backgroundColor: secondrayColor,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        color: "white"
                    }}>{accountLinked ? 'Login' : 'Account Linked'}</Text>
                </TouchableOpacity>

                <TouchableOpacity disabled={accountLinked} onPress={handleOpenURL} style={{
                    backgroundColor: primaryColorLR,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        color: "white"
                    }}>Get Token</Text>
                </TouchableOpacity>

                <TouchableOpacity disabled={!accountLinked} onPress={() => useEGSStore.getState().unlinkEpicGamesServices(oauthToken.access_token)} style={{
                    backgroundColor: 'red',
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        color: "white"
                    }}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity disabled={!accountLinked} onPress={() => useEGSStore.getState().checkTokenStatus(oauthToken)} style={{
                    backgroundColor: primaryColorLR,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        color: "white"
                    }}>Validate Token</Text>
                </TouchableOpacity>

                <View style={{
                    backgroundColor: primaryColorLR,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        color: "white"
                    }}>{oauthToken ? oauthToken.access_token : "Token Not Generated Yet"}</Text>
                </View>

                <View style={{
                    backgroundColor: primaryColorLR,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 3,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={{
                        color: "white"
                    }}>{oauthToken ? oauthToken.expires_at : "Token Not Generated Yet"}</Text>
                </View>
            </View>

            <Toast />

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
