import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import TextInput from '../helpers/TextInput'
import axios from 'axios'
import Toast from 'react-native-toast-message'
import useAuthStore from '../helpers/useAuthStore';

export default function Login({ navigation }) {

    const { t } = useTranslation()

    const [rememberMe, setRememberMe] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailErrored, setEmailErrored] = useState(false)
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [passwordErrored, setPasswordErrored] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState(false)

    // Authentication
    const { login } = useAuthStore(state => ({
        login: state.login,
    }));

    async function validateInputs() {

        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email using regular expression
        if (!emailRegex.test(email)) {
            setEmailErrored(!emailRegex.test(email))
            Toast.show({
                type: 'info',
                text1: 'Something missing!',
                text2: 'Please fill in your email.',
                visibilityTime: 5000,
                autoHide: true,

            })
            return
        }

        // Validate password
        if (!emailRegex.test(email)) {
            setPasswordErrored(password.length === 0)
            Toast.show({
                type: 'info',
                text1: 'Something missing!',
                text2: 'Please fill in password.',
                visibilityTime: 5000,
                autoHide: true,

            })
            return
        }

        try {
            await login(email.toLowerCase(), password);
        } catch (error) {

            Toast.show({
                type: 'error',
                text1: 'Errored',
                text2: error,
                visibilityTime: 5000,
                autoHide: true,

            })

            // Update fields
            setEmailErrored(true)
            setPasswordErrored(true)

        }
    }

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>

            <View style={{ marginTop: 150, margin: 50, width: '85%', position: "absolute" }}>

                {/* <Text style={{ fontSize: 50, fontWeight: 'bold', textAlign: 'left', bottom: 40, color: "white", marginTop: 50 }}>Sign in with password</Text> */}

                <TextInput containerStyle={{ marginBottom: 10 }} errored={emailErrored} success={emailSuccess} keyboardType='email-address' placeholder='Email' placeholderTextColor={"white"} onChangeText={(val) => setEmail(val)} updateValidation={() => {
                    setEmailErrored(false)
                    setEmailSuccess(false)
                }} />

                <TextInput containerStyle={{ marginBottom: 10 }} secureTextEntry errored={passwordErrored} success={passwordSuccess} placeholder='Password' placeholderTextColor={"white"} onChangeText={(val) => setPassword(val)} updateValidation={() => {
                    setPasswordErrored(false)
                    setPasswordSuccess(false)
                }} />

                <TouchableOpacity style={{
                    alignItems: "flex-start",
                    marginBottom: 10
                }}>
                    <Text style={{ color: '#1573FE', fontSize: 14, textAlign: 'center' }}>Reset password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={validateInputs}>
                    <View style={{
                        backgroundColor: '#1573FE',
                        padding: 15,
                        borderRadius: 10,
                    }}>
                        <Text style={{ color: 'white', fontSize: 17, textAlign: 'center' }}>Sign In</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                    <Text style={{ marginHorizontal: 10, fontSize: 14, color: 'white' }}>or continue with</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                    <TouchableOpacity style={{ width: "100%", borderColor: '#373636', borderWidth: 2, borderRadius: 10, justifyContent: 'center', alignItems: "center", padding: 10 }}>
                        <Image style={{ width: 35, height: 35 }} source={require('../../assets/logos/google.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ color: 'black', fontSize: 14, textAlign: 'center', paddingRight: 5, color: "white" }}>don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("CreateAnAccount")}>
                        <View style={{
                        }}>
                            <Text style={{ color: '#1573FE', fontSize: 14, textAlign: 'center' }}>sign up now!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast />
        </LinearGradient>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});
