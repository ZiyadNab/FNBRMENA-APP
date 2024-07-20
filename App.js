import React, { useRef, useEffect, useState, useContext } from 'react'
import { Platform, StatusBar, View, TouchableOpacity, Text, Image, Button } from 'react-native';
import { StyleSheet, Animated, Dimensions, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme, useLinkBuilder } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { AntDesign, Feather, Ionicons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CosmeticsScreenUI from './src/main/cosmetics'
import DetailsScreenUI from './src/main/details'
import ItemshopScreenUI from './src/main/itemshop'
import SettingsScreenUI from './src/main/setting'
import QuestsBundleScreenUI from './src/main/quests_bundles'
import QuestsScreenUI from './src/main/quests'
import * as NavigationBar from 'expo-navigation-bar';
import 'react-native-reanimated'
import { PortalProvider } from '@gorhom/portal'
import i18next from './localization/i18n.js'
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import MapScreenUI from './src/main/map'
import getStartedScreen from './src/loginflow/get_started'
import LoginScreen from './src/loginflow/login'
import CreateAccountScreen from './src/loginflow/create'
import colors from './colors.json'
import * as FileSystem from 'expo-file-system';
import useColorStore from './src/helpers/colorsContext'
import AppearanceScreenUI from './src/main/appearance'
import ProfileScreenUI from './src/main/profile'
import Color from 'color'
import useAuthStore from './src/helpers/useAuthStore';
import EGSAccountScreen from './src/loginflow/egs'
import useEGSStore from './src/helpers/useEGSStore';

function getWidth() {
    let width = Dimensions.get("window").width
    width -= 40
    return width / 5
}

function NotificationsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

function BottomTabs({ navigation }) {

    const { t } = useTranslation()
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const secondrayColor = useColorStore(res => res.jsonData.app.secondray)
    const bottomColor = useColorStore(res => res.jsonData.app.bottom)
    const topColor = useColorStore(res => res.jsonData.app.top)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardOpen(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardOpen(false)
        );

        // Clean up listeners when component unmounts
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const tabOffsetValue = useRef(new Animated.Value(0)).current
    const Tab = createBottomTabNavigator()
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        borderTopColor: bottomColor,
                        borderColor: bottomColor,
                        backgroundColor: bottomColor,
                        padding: Platform.OS === "ios" ? 15 : 0,
                        height: Platform.OS === "ios" ? 100 : 80,
                        paddingHorizontal: 40,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        shadowOffset: { width: 0, height: 10 / 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10 / 2,
                        elevation: 10
                    },
                    tabBarHideOnKeyboard: true,
                    headerStyle: {
                        backgroundColor: topColor,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankBigCondensed-Black",
                        fontSize: 30
                    },
                    headerTitle: (props) => <View style={{
                        paddingTop: 10,
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15
                    }}>

                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignItems: "center"
                        }}>

                            <Text style={{
                                fontSize: 25,
                                color: 'white',
                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankBigCondensed-Black"
                            }}>{t(route.name).toUpperCase()}</Text>

                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 15,
                            alignItems: 'center',
                            paddingLeft: 3,
                            justifyContent: 'center',
                        }}>

                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 15,
                                alignItems: 'center',
                                paddingLeft: 3,
                                justifyContent: 'center',
                                marginRight: 5
                            }}>
                                <Image source={require('./assets/cosmetics/others/vbucks.png')} style={{
                                    width: 25,
                                    height: 25,
                                    marginRight: 3
                                }} />

                                <Text style={{
                                    color: 'white',
                                    fontFamily: 'BurbankSmall-Black',
                                    fontSize: 16,
                                    marginRight: 5
                                }}>13,850</Text>
                            </View>

                            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                                <Image source={{ uri: 'https://cdn2.unrealengine.com/fortnite-brite-raider-icon-200x200-d2cb95034d11.png' }} style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                }} />
                                <View style={{
                                    backgroundColor: '#57F000',
                                    position: 'absolute',
                                    width: 13,
                                    height: 13,
                                    borderRadius: 6.5,
                                    bottom: -3,
                                    right: -3,
                                    borderWidth: 2,
                                    borderColor: 'black'
                                }} />
                            </TouchableOpacity>

                        </View>

                    </View>
                })}>

                <Tab.Screen
                    name="cosmetics"
                    component={CosmeticsScreenUI}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return (
                                focused ? (
                                    <Feather name="home" size={size} color={secondrayColor} style={{ backgroundColor: Color(secondrayColor).alpha(0.20).rgb().string(), padding: 10, borderRadius: 10, overflow: "hidden" }} />
                                ) : (
                                    <Feather name="home" size={size} color={"white"} />
                                )
                            )
                        },
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            Animated.spring(tabOffsetValue, {
                                toValue: Platform.OS === "ios" ? 2 : 0,
                                useNativeDriver: true
                            }).start()
                        }
                    })}
                />

                <Tab.Screen
                    name="Quests"
                    component={QuestsScreenUI}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return (
                                focused ? (
                                    <AntDesign name="appstore-o" size={size} color={secondrayColor} style={{ backgroundColor: Color(secondrayColor).alpha(0.20).rgb().string(), padding: 10, borderRadius: 10, overflow: "hidden" }} />
                                ) : (
                                    <AntDesign name="appstore-o" size={size} color={"white"} />
                                )
                            )
                        },
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            Animated.spring(tabOffsetValue, {
                                toValue: getWidth() * (i18next.language === "ar" ? -1.11 : 1.11),
                                useNativeDriver: true
                            }).start()
                        }
                    })}
                />

                <Tab.Screen
                    name="itemshop"
                    component={ItemshopScreenUI}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return (
                                focused ? (
                                    <Ionicons name="cart" size={size} color={secondrayColor} style={{ backgroundColor: Color(secondrayColor).alpha(0.20).rgb().string(), padding: 10, borderRadius: 10, overflow: "hidden" }} />
                                ) : (
                                    <Ionicons name="cart-outline" size={size} color={"white"} />
                                )
                            )
                        },
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            Animated.spring(tabOffsetValue, {
                                toValue: getWidth() * (i18next.language === "ar" ? -2.22 : 2.22),
                                useNativeDriver: true
                            }).start()
                        }
                    })}
                />

                <Tab.Screen
                    name="map"
                    component={MapScreenUI}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => {
                            return (
                                focused ? (
                                    <Feather name="user" size={size} color={secondrayColor} style={{ backgroundColor: Color(secondrayColor).alpha(0.20).rgb().string(), padding: 10, borderRadius: 10, overflow: "hidden" }} />
                                ) : (
                                    <Feather name="user" size={size} color={"white"} />
                                )
                            )
                        },
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            Animated.spring(tabOffsetValue, {
                                toValue: getWidth() * (i18next.language === "ar" ? -3.33 : 3.33),
                                useNativeDriver: true
                            }).start()
                        }
                    })}
                />

            </Tab.Navigator>

            <Animated.View style={{
                display: isKeyboardOpen ? 'none' : 'flex',
                width: Platform.OS === "ios" ? getWidth() - 45 : getWidth() - 40,
                height: 3,
                backgroundColor: secondrayColor,
                position: 'absolute',
                bottom: Platform.OS === "ios" ? 25 : 10,
                left: 64,
                borderRadius: 5,
                transform: [{
                    translateX: tabOffsetValue
                }]
            }}>

            </Animated.View>
        </GestureHandlerRootView>

    )
};

function Drawer() {

    const { t } = useTranslation()
    const secondrayColor = useColorStore(res => res.jsonData.app.secondray);
    const Drawer = createDrawerNavigator();

    return (

        <Drawer.Navigator screenOptions={({ route, navigation }) => ({
            headerShown: false,
            drawerStyle: {
                backgroundColor: "black",
            },
            swipeEdgeWidth: 1000,
            drawerActiveTintColor: secondrayColor,
            drawerInactiveTintColor: 'white',
            gestureHandlerProps: {
                activeOffsetX: 20
            },
            drawerIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name.toLowerCase() === 'home') {
                    iconName = 'home';
                } else if (route.name.toLowerCase() === 'bookmarks') {
                    iconName = 'bookmark';
                } else if (route.name.toLowerCase() === 'reminders') {
                    iconName = 'bell';
                } else if (route.name.toLowerCase() === 'settings') {
                    iconName = 'settings';
                } else if (route.name.toLowerCase() === 'friends') {
                    iconName = 'users';
                } else if (route.name.toLowerCase() === 'twitter') {
                    iconName = 'x-twitter';
                } else if (route.name.toLowerCase() === 'discord') {
                    iconName = 'discord';
                } else if (route.name.toLowerCase() === 'account') {
                    iconName = 'account-circle';
                }

                if (iconName === 'account-circle' || iconName === 'discord') {
                    return (
                        <MaterialIcons name={iconName} size={size} color={color} />
                    );
                } else if (iconName === 'x-twitter') {
                    return (
                        <FontAwesome6 name={iconName} size={size} color={color} />
                    );
                }

                return (
                    <Feather name={iconName} size={size} color={color} />
                );
            }

        })} drawerContent={(props) => <CustomDrawerContent {...props} />} initialRouteName="HOME">
            <Drawer.Screen options={{ title: t("home").toUpperCase() }} name="home" component={BottomTabs} />
            <Drawer.Screen options={{ title: t("bookmarks").toUpperCase() }} name="bookmarks" component={NotificationsScreen} />
            <Drawer.Screen options={{ title: t("reminders").toUpperCase() }} name="reminders" component={NotificationsScreen} />
            <Drawer.Screen options={{ swipeEnabled: false, title: t("settings").toUpperCase() }} name="settings" component={Settings} />
            <Drawer.Screen options={{ title: t("account").toUpperCase() }} name="account" component={EGS} />
            <Drawer.Screen options={{ title: t("friends").toUpperCase() }} name="friends" component={NotificationsScreen} />
            <Drawer.Screen options={{ title: t("discord").toUpperCase() }} name="discord" component={NotificationsScreen} />
            <Drawer.Screen options={{ title: t("twitter").toUpperCase() }} name="twitter" component={NotificationsScreen} />
        </Drawer.Navigator>
    )
}

function Tabs() {

    const HomeScreenStack = createStackNavigator()
    return (
        <HomeScreenStack.Navigator screenOptions={{
            headerShown: false
        }}>

            <HomeScreenStack.Screen
                name="Drawer"
                component={Drawer}

            />

            <HomeScreenStack.Screen
                name="DetailsScreen"
                component={DetailsScreenUI}
            />

            <HomeScreenStack.Screen
                name="QuestsBundleScreen"
                component={QuestsBundleScreenUI}
            />

        </HomeScreenStack.Navigator>
    )
}

function CustomDrawerContent(props) {
    const { t } = useTranslation()

    const { state, descriptors, navigation } = props;
    const buildLink = useLinkBuilder();

    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor.options;

    // const { user } = useAuthStore(state => ({
    //     user: state.user,
    // }));

    const {
        drawerActiveTintColor,
        drawerInactiveTintColor,
        drawerActiveBackgroundColor,
        drawerInactiveBackgroundColor,
    } = focusedOptions;

    return (
        <DrawerContentScrollView {...props}>
            <View style={{
                width: "100%",
                marginTop: 20
            }}>

                <View style={{
                    padding: 10,
                }}>
                    <View style={{
                        flexDirection: "row",

                    }}>
                        <View>
                            <Image source={{ uri: 'https://cdn2.unrealengine.com/fortnite-brite-raider-icon-200x200-d2cb95034d11.png' }} style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                borderColor: "black",
                                borderWidth: 3
                            }} />
                            <View style={{
                                backgroundColor: '#57F000',
                                position: 'absolute',
                                width: 15,
                                height: 15,
                                borderRadius: 7.5,
                                bottom: 2,
                                right: 2,
                                borderWidth: 2,
                                borderColor: 'black'
                            }} />
                        </View>

                        <View style={{
                            marginLeft: 10
                        }}>
                            <Text style={{
                                color: "white",
                                fontSize: 14,
                                opacity: 0.5,
                                marginTop: 10
                            }}>{t("good_morning")}</Text>
                            <Text style={{
                                fontFamily: "BurbankSmall-Black",
                                color: "white",
                                fontSize: 20,
                            }}>oi</Text>
                        </View>
                    </View>
                </View>

                {state.routes.map((route, index) => {
                    const { drawerLabel, title, drawerIcon, drawerAllowFontScaling, drawerLabelStyle, drawerItemStyle } = descriptors[route.key].options;
                    const label = drawerLabel !== undefined ? drawerLabel : title !== undefined ? title : route.name;
                    const isFocused = state.index === index;

                    return (
                        <View key={route.key}>

                            {
                                index === 4 ? (
                                    <View style={{
                                        padding: 20,
                                    }}>

                                        <Text style={{
                                            color: "gray"
                                        }}>{t("egs").toUpperCase()}</Text>
                                    </View>
                                ) : index === 6 ? (
                                    <View style={{
                                        padding: 20,
                                    }}>

                                        <Text style={{
                                            color: "gray"
                                        }}>{t("contact").toUpperCase()}</Text>
                                    </View>
                                ) : null
                            }

                            <DrawerItem
                                label={label}
                                icon={drawerIcon}
                                focused={isFocused}
                                activeTintColor={drawerActiveTintColor}
                                inactiveTintColor={drawerInactiveTintColor}
                                activeBackgroundColor={drawerActiveBackgroundColor}
                                inactiveBackgroundColor={drawerInactiveBackgroundColor}
                                allowFontScaling={drawerAllowFontScaling}
                                labelStyle={drawerLabelStyle}
                                style={drawerItemStyle}
                                to={buildLink(route.name, route.params)}
                                onPress={() => navigation.navigate(route.name)}
                            />
                        </View>
                    );
                })}
            </View>
        </DrawerContentScrollView>
    );
}

function Settings() {

    const { t } = useTranslation()
    const HomeScreenStack = createStackNavigator()
    return (
        <HomeScreenStack.Navigator screenOptions={({ route, navigation }) => ({
            headerStyle: {
                backgroundColor: "#000",
            },
            headerTitleStyle: {
                color: "white"
            },
            headerTintColor: "white",
        })}>

            <HomeScreenStack.Screen
                name={"setting"}
                options={{ title: t("settings") }}
                component={SettingsScreenUI}
            />

            <HomeScreenStack.Screen
                name={"profile"}
                options={{ title: t("profile") }}
                component={ProfileScreenUI}
            />

            <HomeScreenStack.Screen
                name={"appearance"}
                options={{ title: t("appearance") }}
                component={AppearanceScreenUI}
            />

        </HomeScreenStack.Navigator>
    )
}

function EGS() {

    const { t } = useTranslation()
    const HomeScreenStack = createStackNavigator()
    return (
        <HomeScreenStack.Navigator screenOptions={({ route, navigation }) => ({
            headerStyle: {
                backgroundColor: "#000",
            },
            headerTitleStyle: {
                color: "white"
            },
            headerTintColor: "white",
        })}>

            <HomeScreenStack.Screen
                name={"egs_account"}
                options={{ headerShown: false, title: t("account") }}
                component={EGSAccountScreen}
            />

        </HomeScreenStack.Navigator>
    )
}

export default function App() {

    const backgroundColor = useColorStore(res => res.jsonData.app.background);
    const Stack = createStackNavigator();

    if (Platform.OS === "android") {
        NavigationBar.setVisibilityAsync("hidden");
        NavigationBar.setBackgroundColorAsync("black");
        NavigationBar.useVisibility(null)
    }

    // const { isAuthenticated, checkAuth } = useAuthStore(state => ({
    //     isAuthenticated: state.isAuthenticated,
    //     checkAuth: state.checkAuth,
    // }));

    useEffect(() => {

        // checkAuth();

        const saveColorsJson = async () => {
            const fileUri = FileSystem.documentDirectory + 'data.json';
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(colors));
        };

        const LANGUAGE_STORAGE_KEY = '@app_language';
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
                if (storedLanguage) {
                    i18next.changeLanguage(storedLanguage);
                }
            } catch (e) {
                console.log(e)
            }

        }

        function loadEGS() {
            useEGSStore.getState().initializeEpicGamesServiesAuthorzation()
            
        }

        loadEGS()
        saveColorsJson()
        loadLanguage()
    }, [])

    const [fontLoaded] = useFonts({
        ...MaterialIcons.font,
        ...AntDesign.font,
        ...Feather.font,
        ...Ionicons.font,
        "BurbankBigCondensed-Black": require('./assets/fonts/BurbankBigCondensed-Black.ttf'),
        "BurbankSmall-Black": require('./assets/fonts/BurbankSmall-Black.otf'),
        "Lalezar-Regular": require('./assets/fonts/Lalezar-Regular.ttf'),
        "GeneralSans-Variable": require('./assets/fonts/GeneralSans-Variable.ttf'),
    });

    if (!fontLoaded) return null

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: backgroundColor,
        },
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
            <PortalProvider>
                <NavigationContainer theme={theme}>
                    <Tabs />
                </NavigationContainer>
            </PortalProvider>
        </GestureHandlerRootView>

    )

    // (
    //     <GestureHandlerRootView style={{ flex: 1 }}>
    //         <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
    //         <PortalProvider>
    //             <NavigationContainer theme={theme}>
    //                 <Stack.Navigator
    //                     screenOptions={{
    //                         headerShown: false
    //                     }}>

    //                     <Stack.Screen
    //                         name="getStarted"
    //                         component={getStartedScreen}

    //                     />

    //                     <Stack.Screen
    //                         name="LoginScreen"
    //                         component={LoginScreen}
    //                         options={{ title: "Login" }}

    //                     />

    //                     <Stack.Screen
    //                         name="CreateAccountScreen"
    //                         component={CreateAccountScreen}

    //                     />

    //                 </Stack.Navigator>
    //             </NavigationContainer>
    //         </PortalProvider>
    //     </GestureHandlerRootView>

    // )
}
