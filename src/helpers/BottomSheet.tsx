import { Dimensions, StyleSheet, Platform, View, Text, NativeScrollEvent } from 'react-native';
import React, { useCallback, useRef, useImperativeHandle, useState } from 'react';
import { Gesture, GestureDetector, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -700;

type BackgroundColors = {
  color?: string
  Color1: string;
  Color2: string;
  Color3: string;
  Color4: string;
  Color5: string;
}

type BottomSheetProps = {
  children?: React.ReactNode | [React.ReactNode];
  onTranslationYChange?: (translationY: number, animated: boolean) => void;
  background?: BackgroundColors;
  type?: string
  audio?: {
    function: null | Function
    value: null | boolean
  }
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
  hasData: (val: boolean) => void;
};

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, onTranslationYChange, background, type, audio = { function: null, value: null } }, ref) => {
    const translateY = useSharedValue(type === "details" ? -385 : 100);
    const active = useSharedValue(false);
    const data = useSharedValue(false);
    const scrollBegin = useSharedValue(0);
    const [enableScroll, setEnableScroll] = useState(false);
    const scrollY = useSharedValue(0);

    const checkSheetActive = () => {
      if (type === "details") {
        if (active.value) scrollTo(-385)
        else if (children) scrollTo(-700)
      } else {
        if (!active.value) scrollTo(-385)
        else if (children) scrollTo(-700)
      }
    }

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      if (type === "details") active.value = destination !== -385;
      else active.value = destination === -385;

      translateY.value = withSpring(destination, { damping: 15 });
      if (onTranslationYChange) runOnJS(onTranslationYChange)(destination, true);

    }, [translateY.value]);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    const hasData = useCallback((val: boolean) => {
      data.value = val;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive, hasData }), [
      scrollTo,
      isActive,
      hasData,
    ]);

    const onScroll = useAnimatedScrollHandler({
      onBeginDrag: event => {
        scrollBegin.value = event.contentOffset.y;
      },
      onScroll: event => {
        scrollY.value = event.contentOffset.y;
      },
    });

    const tBottomSheetStyle = useAnimatedStyle(() => {

      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 100, MAX_TRANSLATE_Y],
        [25, 10],
        Extrapolation.CLAMP
      );

      return {
        borderRadius,
      };
    });

    const context = useSharedValue({ y: 0 });
    const panScroll = Gesture.Pan()
      .onBegin(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate(event => {
        translateY.value = event.translationY + context.value.y - scrollBegin.value;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        if (onTranslationYChange) runOnJS(onTranslationYChange)(translateY.value, false);
        if (event.translationY > 0 && scrollY.value === 0) {
          runOnJS(setEnableScroll)(false);
        }
      })
      .onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 6) {
          scrollTo(type === "details" ? Platform.OS === 'ios' ? -50 : 0 : 100);
        } else if (translateY.value > -SCREEN_HEIGHT / 1.6) {
          scrollTo(-385);
        } else if (translateY.value < -SCREEN_HEIGHT / 1.6) {
          scrollTo(MAX_TRANSLATE_Y);
          runOnJS(setEnableScroll)(true);
        }
      });

    const scrollViewGesture = Gesture.Native();

    return (
      <Animated.View style={[styles.bottomSheetContainer, tBottomSheetStyle, rBottomSheetStyle, { backgroundColor: type === "details" ? background.Color3 : background.color, elevation: 10, shadowOffset: { width: 0, height: 10 / 2 }, shadowOpacity: 0.3, shadowRadius: 10 / 2 }]}>
        <AnimatedSvg width="100%" height="100%" viewBox="0 -30 200 900" style={rBottomSheetStyle}>
          {
            type === "details" ? (
              <Path
                d="M 126.747 132.656 C 130.074 66.6065 190.054 33.0868 219.628 24.5832 L 333.765 0 L 337 509.289 C 339.3333 613.8593 341.6667 718.4297 344 823 C 341 1034 381 984 -87 984 C 113 767 -122 780 -64 531 C -48 438 -19.1831 378.674 38.4864 340.454 C 110.573 292.679 122.588 215.219 126.747 132.656"
                fill={background.Color2}
              />
            ) : null
          }
          <TouchableOpacity onPress={checkSheetActive}>
            <View style={styles.line} />
            {
              audio.function ? (
                <View style={{
                  position: 'absolute',
                  right: 5,
                  bottom: 10
                }}>
                  <TouchableOpacity onPress={() => audio.function(!audio.value)} style={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 5, // Add margin between buttons for spacing
                  }}>
                    {
                      audio.value ? (
                        <Octicons name='mute' size={20} color={"white"} />
                      ) : (
                        <Octicons name='unmute' size={20} color={"white"} />
                      )
                    }
                  </TouchableOpacity>
                </View>
              ) : null
            }
          </TouchableOpacity>
          <Animated.View style={[{ width: '100%', height: '100%', backgroundColor: type === "details" ? 'rgba(0, 0, 0, 0.5)' : null }, rBottomSheetStyle]}>
            <GestureDetector
              gesture={Gesture.Simultaneous(scrollViewGesture, panScroll)}>
              <Animated.ScrollView
                onScroll={onScroll}
                showsVerticalScrollIndicator={false}
                scrollEnabled={enableScroll}
                bounces={false}
                scrollEventThrottle={16}
                directionalLockEnabled={true}
              >
                {children}
              </Animated.ScrollView>
            </GestureDetector>
          </Animated.View>
        </AnimatedSvg>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 115,
    height: 7,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginVertical: -15,
    borderRadius: 3,
  },
});

export default BottomSheet;
