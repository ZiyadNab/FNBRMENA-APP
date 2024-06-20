import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = ({ targetDate, style }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = new Date(targetDate) - now;
    const hoursLeft = difference / (1000 * 60 * 60);
    return Math.max(0, hoursLeft.toFixed(2)); // Return 0 if difference is negative
  };

  const [hoursLeft, setHoursLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setHoursLeft(calculateTimeLeft());
    }, 60000); // Update every minute (60000 milliseconds)

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  return (
    <View style={[style]}>
      <Text style={[style]}>{`${hoursLeft.toFixed(0)} hours left`.toUpperCase()}</Text>
    </View>
  );
};

export default Timer;
