import React, { useRef, useEffect, useState } from 'react'
import { StatusBar } from 'react-native';
import { StyleSheet, Platform, View, Animated, Dimensions, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CosmeticsScreenUI from './src/main/cosmetics'
import DetailsScreenUI from './src/main/details'
import ItemshopScreenUI from './src/main/itemshop'
import * as NavigationBar from 'expo-navigation-bar';
import 'react-native-reanimated'
import { PortalProvider } from '@gorhom/portal'

function getWidth() {
  let width = Dimensions.get("window").width
  width -= 40
  return width / 5
}

function HomeScreen() {
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
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [styles.tabBar, { opacity: isKeyboardOpen ? 0 : 1 }],

        }}>

        <Tab.Screen
          name="Cosmetics"
          component={CosmeticsScreenUI}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return (
                focused ? (
                  <Feather name="home" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10 }} />
                ) : (
                  <Feather name="home" size={size} color={color} />
                )
              )
            },
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true
              }).start()
            }
          })}
        />

        <Tab.Screen
          name="MarketS"
          component={ItemshopScreenUI}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return (
                focused ? (
                  <AntDesign name="appstore-o" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10 }} />
                ) : (
                  <AntDesign name="appstore-o" size={size} color={color} />
                )
              )
            },
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 1.25,
                useNativeDriver: true
              }).start()
            }
          })}
        />

        <Tab.Screen
          name="ItemShop"
          component={ItemshopScreenUI}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return (
                focused ? (
                  <Ionicons name="cart" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10 }} />
                ) : (
                  <Ionicons name="cart-outline" size={size} color={color} />
                )
              )
            },
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 2.5,
                useNativeDriver: true
              }).start()
            }
          })}
        />

        <Tab.Screen
          name="Profile"
          component={ItemshopScreenUI}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return (
                focused ? (
                  <Feather name="user" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10 }} />
                ) : (
                  <Feather name="user" size={size} color={color} />
                )
              )
            },
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3.75,
                useNativeDriver: true
              }).start()
            }
          })}
        />

      </Tab.Navigator>

      <Animated.View style={{
        width: getWidth() - 40,
        height: 3,
        backgroundColor: '#1573FE',
        position: 'absolute',
        bottom: 30,
        left: 49,
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
  NavigationBar.setVisibilityAsync("hidden");
  NavigationBar.setBackgroundColorAsync("black");
  NavigationBar.useVisibility(null)

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#1d1f24'
      ,
    },
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
      <PortalProvider>
        <NavigationContainer theme={theme}>
          <HomeScreenStack.Navigator
            screenOptions={{
              // presentation: 'transparentModal',
              headerShown: false,
            }}>

            <HomeScreenStack.Screen
              name="HomeScreen"
              component={HomeScreen}

            />

            <HomeScreenStack.Screen
              name="DetailsScreen"
              component={DetailsScreenUI}
            />

          </HomeScreenStack.Navigator>
        </NavigationContainer>
      </PortalProvider>
    </GestureHandlerRootView>

  )

}

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: '#1d1f24',
    borderColor: '#1d1f24',
    backgroundColor: '#1d1f24',
    height: 60,
    padding: Platform.OS === 'ios' ? 10 : 0,
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 10 / 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10 / 2,
    elevation: 10
  },
});