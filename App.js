import React, { useRef, useEffect, useState } from 'react'
import { Platform, StatusBar, View, TouchableOpacity, Text, Image } from 'react-native';
import { StyleSheet, Animated, Dimensions, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CosmeticsScreenUI from './src/main/cosmetics'
import DetailsScreenUI from './src/main/details'
import ItemshopScreenUI from './src/main/itemshop'
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

function getWidth() {
  let width = Dimensions.get("window").width
  width -= 40
  return width / 5
}

function HomeScreen() {
  const { t } = useTranslation()

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
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
          tabBarStyle: styles.tabBar,
          tabBarHideOnKeyboard: true,
          headerStyle: {
            backgroundColor: 'black',
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

              <View>
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
              </View>

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
                  <Feather name="home" size={size} color={"#009BFF"} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 10, overflow: "hidden" }} />
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
                  <AntDesign name="appstore-o" size={size} color={"#009BFF"} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 10, overflow: "hidden" }} />
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
                  <Ionicons name="cart" size={size} color={"#009BFF"} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 10 }} />
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
                  <Feather name="user" size={size} color={"#009BFF"} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 10, overflow: "hidden" }} />
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
        backgroundColor: "#009BFF",
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

export default function App() {
  const HomeScreenStack = createStackNavigator()
  const Stack = createStackNavigator();
  if (Platform.OS === "android") {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBackgroundColorAsync("black");
    NavigationBar.useVisibility(null)
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#000'
      ,
    },
  }

  useEffect(() => {

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
    loadLanguage()
  }, [])

  const [fontLoaded] = useFonts({
    ...AntDesign.font,
    ...Feather.font,
    ...Ionicons.font,
    "BurbankBigCondensed-Black": require('./assets/fonts/BurbankBigCondensed-Black.ttf'),
    "BurbankSmall-Black": require('./assets/fonts/BurbankSmall-Black.otf'),
    "Lalezar-Regular": require('./assets/fonts/Lalezar-Regular.ttf'),
    "GeneralSans-Variable": require('./assets/fonts/GeneralSans-Variable.ttf'),
  });

  if (!fontLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
      <PortalProvider>
        <NavigationContainer theme={theme}>
          <HomeScreenStack.Navigator screenOptions={{
            headerShown: false
          }}>

            <HomeScreenStack.Screen
              name="Cosmetics"
              component={HomeScreen}

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
        </NavigationContainer>
      </PortalProvider>
    </GestureHandlerRootView>

  )

  // return (
  //   <GestureHandlerRootView style={{ flex: 1 }}>
  //     <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
  //     <PortalProvider>
  //       <NavigationContainer theme={theme}>
  //         <HomeScreenStack.Navigator
  //           screenOptions={{
  //             headerShown: false,
  //           }}>

  //           <HomeScreenStack.Screen
  //             name="getStarted"
  //             component={getStartedScreen}

  //           />

  //           <HomeScreenStack.Screen
  //             name="LoginScreen"
  //             component={LoginScreen}

  //           />

  //           <HomeScreenStack.Screen
  //             name="CreateAccountScreen"
  //             component={CreateAccountScreen}

  //           />

  //         </HomeScreenStack.Navigator>
  //       </NavigationContainer>
  //     </PortalProvider>
  //   </GestureHandlerRootView>

  // )
}



const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: '#191919',
    borderColor: '#191919',
    backgroundColor: '#191919',
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
});
