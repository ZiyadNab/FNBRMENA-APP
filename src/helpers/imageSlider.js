import React, { useRef, useEffect, memo, useState, useCallback } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const AutoScrollingScrollView = ({ images, width, height, placeholder }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextIndex = (currentIndex + 1) % images.length;
        const scrollPosition = width * nextIndex;
        scrollViewRef.current.scrollTo({
          x: scrollPosition,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]); // Add currentIndex as a dependency

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
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    >
      {images.map((image, index) => {
        return placeholder ? (
          <View style={{ width: width, height: height }}>
            <Image
              source={getRarityPath("common")}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              cachePolicy='disk'
            />
            <View style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: image }}
              style={{ width: '75%', height: '75%' }}
            />
            </View>
          </View>
        ) : (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width: width, height: height }}

          />
        )
      }

      )}
    </ScrollView>
  );
};

export default memo(AutoScrollingScrollView)
