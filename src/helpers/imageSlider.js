import React, { useRef, useEffect, memo, useState } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const AutoScrollingScrollView = ({ images, width, height }) => {
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
  
  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    >
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          style={{ width: width, height: height }}
          
        />
      ))}
    </ScrollView>
  );
};

export default memo(AutoScrollingScrollView)
