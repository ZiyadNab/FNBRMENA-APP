import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
import BottomSheet from '../helpers/BottomSheet';
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'
import MapView, { UrlTile, Marker, Callout } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import useAuthStore from '../helpers/useAuthStore';
import TextInput from '../helpers/TextInput'
import Color from 'color'
import useColorStore from '../helpers/colorsContext';
import { FlatList } from 'react-native-gesture-handler';

export default function Profile({ navigation }) {

    const [email, setEmail] = useState('')
    const [emailErrored, setEmailErrored] = useState(false)
    const [emailSuccess, setEmailSuccess] = useState(false)
    const secondrayColor = useColorStore(res => res.jsonData.app.secondray);
    const primaryColorLR = useColorStore(res => res.jsonData.app.primary);
    const { logout, user } = useAuthStore(state => ({
        logout: state.logout,
        user: state.user
    }));

    useEffect(() => {
        logout()
    }, [])

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>
            <View style={{
                width: '90%',
            }}>
                <View style={{
                    backgroundColor: Color(secondrayColor).alpha(0.20).rgb().string(),
                    marginTop: 20,
                    padding: 10,
                    borderRadius: 5,
                    flexDirection: "row",
                    width: '100%',
                    alignItems: "center"
                }}>
                    <Image source={{ uri: 'https://cdn2.unrealengine.com/fortnite-brite-raider-icon-200x200-d2cb95034d11.png' }} style={{
                        width: 75,
                        height: 75,
                        borderRadius: 35,
                        marginRight: 30
                    }} />

                    <View>
                        <Text style={{
                            color: "white",
                            fontSize: 30,
                            fontFamily: "BurbankBigCondensed-Black"
                        }}>{user.displayname.toUpperCase()}</Text>
                        <Text style={{
                            color: "white",
                            opacity: 0.2,
                            fontSize: 11,
                        }}>{user.email.toLowerCase()}</Text>
                    </View>
                </View>

                <View style={{
                    backgroundColor: primaryColorLR,
                    borderRadius: 5,
                    width: "100%",
                    padding: 5,
                    marginTop: 20,
                }}>

                    <TouchableOpacity style={{
                        paddingVertical: 10,
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
                            }}>
                                <View style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    padding: 10,
                                    borderRadius: 5,
                                    width: 50,
                                    height: 50,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <MaterialIcons name="manage-accounts" size={30} color="white" />
                                </View>
                                <View style={{
                                    marginLeft: 20,
                                    maxWidth: "77%",
                                }}>
                                    <Text style={{
                                        color: "white",
                                        fontSize: 15
                                    }}>Account</Text>
                                    <Text style={{
                                        color: "white",
                                        opacity: 0.5,
                                        fontSize: 10
                                    }}>Update your account information</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="white" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        paddingVertical: 10,
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
                            }}>
                                <View style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    padding: 10,
                                    borderRadius: 5,
                                    width: 50,
                                    height: 50,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <MaterialIcons name="password" size={30} color="white" />
                                </View>
                                <View style={{
                                    marginLeft: 20,
                                    maxWidth: "77%",
                                }}>
                                    <Text style={{
                                        color: "white",
                                        fontSize: 15
                                    }}>Password</Text>
                                    <Text style={{
                                        color: "white",
                                        opacity: 0.5,
                                        fontSize: 10
                                    }}>Change your account passowrd,</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="white" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        paddingVertical: 10,
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
                            }}>
                                <View style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    padding: 10,
                                    borderRadius: 5,
                                    width: 50,
                                    height: 50,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <FontAwesome name="remove" size={30} color="white" />
                                </View>
                                <View style={{
                                    marginLeft: 20,
                                    maxWidth: "77%",
                                }}>
                                    <Text style={{
                                        color: "white",
                                        fontSize: 15
                                    }}>Delete Account</Text>
                                    <Text style={{
                                        color: "white",
                                        opacity: 0.5,
                                        fontSize: 10
                                    }}>Delete your account permanently.</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="white" />
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={{
                    backgroundColor: primaryColorLR,
                    borderRadius: 5,
                    width: "100%",
                    padding: 5,
                    marginTop: 20,
                }}>

                    <FlatList
                        data={user.login_history}
                        renderItem={({ item }) => (
                            <View style={{

                            }}>

                            </View>
                        )}
                    />
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
