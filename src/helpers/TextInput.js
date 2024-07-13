import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNReanimated, { useSharedValue, useDerivedValue, interpolate, withSpring, withTiming, useAnimatedStyle } from 'react-native-reanimated'

const CustomInput = ({ containerStyle, placeholder, onChangeText, errored, success, updateValidation, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;
  const inputAnimatedBorder = useSharedValue('#D9D9D9')

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!text) {
      animatedLabel(0);
    }
  };

  const handleTextChange = useCallback((text) => {
    updateValidation()
    inputAnimatedBorder.value = withTiming('#1573FE');

    setText(text);
    if (onChangeText) {
      onChangeText(text);
    }
    if (text) {
      animatedLabel(1);
    } else {
      animatedLabel(isFocused ? 1 : 0);
    }
  }, [])

  useEffect(() => {
    if (errored) inputAnimatedBorder.value = withTiming('#E84E5B');
    else if (success) inputAnimatedBorder.value = withTiming('#15FEA2');
    else if(text.length === 0) inputAnimatedBorder.value = withTiming('#373636');

  }, [errored, success])

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    left: 10,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [19, -10],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ['gray', errored ? "#E84E5B" : success ? "#15FEA2" : text.length !== 0 ? "#1573FE" : "#888"],
    }),
  };

  return (
    <View style={containerStyle}>
      <RNReanimated.View style={[styles.innerContainer, { borderColor: inputAnimatedBorder }]}>
        <Animated.Text style={[styles.label, labelStyle]}>{placeholder}</Animated.Text>
        <View style={styles.inputContainer}>
          <TextInput
            {...props}
            style={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleTextChange}
            value={text}
            textAlignVertical="center"
            textContentType={props.secureTextEntry ? 'newPassword' : props.secureTextEntry}
            secureTextEntry={showPassword}
            placeholderTextColor={"white"}
          />
          {props.secureTextEntry && !!text && (
            <View>
              <TouchableOpacity
                style={{ width: 24 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <Icon name="eye-outline" color={'gray'} size={24} />
                ) : (
                  <Icon name="eye-off-outline" color={'gray'} size={24} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </RNReanimated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 2,
    borderRadius: 5,
    height: 60,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    color: 'gray',
    backgroundColor: '#000',
    paddingHorizontal: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 50,
    marginTop: 10,
    paddingLeft: 10,
    color: "white"
  },
});

export default (CustomInput);