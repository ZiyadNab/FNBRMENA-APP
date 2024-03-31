import React, { memo, useCallback } from 'react'
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

const RenderItem = ({ item, navigation }) => {

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

    return (
        <TouchableOpacity onPress={() => navigation.navigate("DetailsScreen", { data: item })} style={{ width: 109, height: 109, margin: 5, borderRadius: 5 }}>
            <Image
                source={getRarityPath(item.series ? item.series.id : item.rarity.id)}
                style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
                cachePolicy='disk'
            />
            <Image
                source={{ uri: item.images.icon }}
                onError={() => ({ uri: 'https://imgur.com/HVH5sqV.png' })}
                style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
                cachePolicy='memory'
            />
        </TouchableOpacity>
    );
}

export default memo(RenderItem)