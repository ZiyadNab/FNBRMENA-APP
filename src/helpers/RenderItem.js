import React, { memo, useCallback, useState, useEffect } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import colors from '../../colors.json';
import useEGSStore from './useEGSStore';

const RenderItem = ({ item, navigation, bottomSheetRef, owned }) => {
    const accountLinked = useEGSStore(res => res.isEpicGamesAccountLinked);

    const getRarityPath = useCallback((rarity) => {
        const rarityLower = rarity.toLowerCase();
        switch (rarityLower) {
            case 'cubeseries':
                return require('../../assets/cosmetics/rarities/dark.png');
            case 'frozenseries':
                return require('../../assets/cosmetics/rarities/frozen.png');
            case 'creatorcollabseries':
                return require('../../assets/cosmetics/rarities/icon.png');
            case 'slurpseries':
                return require('../../assets/cosmetics/rarities/slurp.png');
            case 'marvelseries':
                return require('../../assets/cosmetics/rarities/marvel.png');
            case 'lavaseries':
                return require('../../assets/cosmetics/rarities/lava.png');
            case 'shadowseries':
                return require('../../assets/cosmetics/rarities/shadow.png');
            case 'platformseries':
                return require('../../assets/cosmetics/rarities/gaming.png');
            case 'dcuseries':
                return require('../../assets/cosmetics/rarities/dc.png');
            case 'columbusseries':
                return require('../../assets/cosmetics/rarities/starwars.png');
            case 'legendary':
                return require('../../assets/cosmetics/rarities/legendary.png');
            case 'epic':
                return require('../../assets/cosmetics/rarities/epic.png');
            case 'rare':
                return require('../../assets/cosmetics/rarities/rare.png');
            case 'uncommon':
                return require('../../assets/cosmetics/rarities/uncommon.png');
            case 'common':
                return require('../../assets/cosmetics/rarities/common.png');
            default:
                return require('../../assets/cosmetics/rarities/common.png');
        }
    }, [])

    function itemClicked() {

        // Release the bottomsheet if enabled
        if (bottomSheetRef.current?.isActive()) bottomSheetRef.current?.scrollTo(100)

        // Go into the item screen
        navigation.navigate("DetailsScreen", { data: item })
    }

    return (
        <TouchableOpacity onPress={itemClicked} style={{ width: 109, height: accountLinked ? 125 : 109, margin: 5, borderRadius: 5, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.cosmetics[item.series ? item.series.id : item.rarity.id].colors.Color1 }}>

            <View style={{
                backgroundColor: owned.includes(item.id.toLowerCase()) ? "#0E4B37" : 'red',
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 5
            }}>
                <Image
                    source={getRarityPath(item.series ? item.series.id : item.rarity.id)}
                    style={{ width: '100%', height: accountLinked ? '87.2%' : '100%', position: 'absolute', borderRadius: 5 }}
                />
                <Image
                    source={{ uri: item.images.icon ? item.images.icon : item.displayAssets.length ? item.displayAssets[0].url : 'https://i.ibb.co/XCDwKHh/HVH5sqV.png' }}
                    style={{ width: '100%', height: accountLinked ? '87.2%' : '100%', position: 'absolute', borderRadius: 5 }}
                />
                
                {
                    accountLinked ? (
                        <Text style={{
                            color: owned.includes(item.id.toLowerCase()) ? "#65D087" : "white",
                            fontSize: 10,
                            fontFamily: "BurbankSmall-Black",
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            textAlign: 'center',
                            paddingBottom: 1
                        }}>
                            {owned.includes(item.id.toLowerCase()) ? "OWNED" : 'NOT OWNED'}
                        </Text>
                    ) : null
                }
            </View>

        </TouchableOpacity>
    );
}

export default memo(RenderItem)