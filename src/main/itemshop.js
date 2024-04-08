import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'

export default function Itemshop({ navigation }) {

    return (
        <View style={styles.container}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 50,
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>

                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <Image source={{ uri: 'https://cdn2.unrealengine.com/fortnite-medusa-icon-200x200-86c74fce36ff.png' }} style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }} />

                        <View style={{
                            flexDirection: 'column',
                            marginLeft: 20,
                        }}>
                            <Text style={{ color: 'white' }}>Good morning</Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                                color: 'white'
                            }}>OHY_</Text>
                        </View>
                    </View>
                    <Octicons name="three-bars" size={30} color="white" />

                </View>

            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
});
