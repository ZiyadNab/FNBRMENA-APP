import React, { memo, useCallback, useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import colors from '../../colors.json';
import { useBookmarks } from '../helpers/bookmark';

const RenderItem = ({ item, navigation, bottomSheetRef }) => {

    const { bookmarks, toggleBookmark } = useBookmarks();
    const [bookmarked, setBookmarked] = useState(false);

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

    useEffect(() => {
        setBookmarked(bookmarks.includes(item.id));
    }, [bookmarks, item.id]);

    return (
        <TouchableOpacity onPress={itemClicked} style={{ width: 109, height: 109, margin: 5, borderRadius: 5 }}>

            <Image
                source={getRarityPath(item.series ? item.series.id : item.rarity.id)}
                style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
                cachePolicy='disk'
            />
            <Image
                source={{ uri: item.images.icon ? item.images.icon : item.displayAssets.length ? item.displayAssets[0].url : 'https://i.ibb.co/XCDwKHh/HVH5sqV.png' }}
                style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 5 }}
            />

            {
                bookmarked ? (
                    <Image style={{
                        width: 15,
                        height: 15,
                        top: 0,
                        right: 4,
                        position: "absolute",
                        tintColor: colors.cosmetics[item.series ? item.series.id : item.rarity.id].colors.Color1
                    }} source={require('../../assets/shop/bookmark.png')} />
                ) : null
            }

        </TouchableOpacity>
    );
}

export default memo(RenderItem)