import React, { useRef, useEffect, useState } from 'react'
import { StatusBar } from 'react-native';
import { StyleSheet, Platform, View, Animated, Dimensions, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import HomeScreenUI from './src/main/home'

function getWidth() {
  let width = Dimensions.get("window").width
  width -= 40
  return width / 5
}

function HomeScreem(){
  const HomeScreenStack = createStackNavigator()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomeScreenStack.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar
        }}>

        <HomeScreenStack.Screen
          name="HomeScreen"
          component={HomeScreenUI}
        />

      </HomeScreenStack.Navigator>
    </GestureHandlerRootView>

  )
};

export default function App() {

  const tabOffsetValue = useRef(new Animated.Value(0)).current
  const Tab = createBottomTabNavigator()

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
          }}>

          <Tab.Screen
            name="Home"
            component={HomeScreem}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  focused ? (
                    <Feather name="home" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10}} />
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
            component={HomeScreem}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  focused ? (
                    <AntDesign name="appstore-o" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10}} />
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
            name="Portfolio"
            component={HomeScreem}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  focused ? (
                    <Ionicons name="file-tray-outline" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10}} />
                  ) : (
                    <Ionicons name="file-tray-outline" size={size} color={color} />
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
            component={HomeScreem}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  focused ? (
                    <Feather name="user" size={size} color={color} style={{ backgroundColor: '#25292e', padding: 10, borderRadius: 10}} />
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
      </NavigationContainer>
    </GestureHandlerRootView>

  )

}

const styles = StyleSheet.create({

  tabBar: {
    borderColor: '#1d1f24',
    backgroundColor: '#1d1f24',
    height: 60,
    padding: Platform.OS === 'ios' ? 30 : 0,
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