import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface CustomButtonProps {
    onPress: () => void
    title: string
}

const RoundedButton: React.FC<CustomButtonProps> = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: '#4C8BF5',
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
    }}
  >
    <Text style={{ color: 'white', textAlign: 'center' }}>{title}</Text>
  </TouchableOpacity>
);

export default RoundedButton