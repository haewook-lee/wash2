import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface CustomButtonProps {
    onPress: any
    title: string
}

const RoundedButton: React.FC<CustomButtonProps> = ({ onPress, title }) => {
  const [isSelected, setIsSelected] = useState(false)

  const handlePress = () => {
    setIsSelected(!isSelected)
    onPress();
  }
  
  return (<TouchableOpacity
    onPress={handlePress}
    style={{
      backgroundColor: isSelected ? '#4C8BF5' : 'white',
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
    }}
  >
    <Text style={{ color: isSelected? 'white' : '#4C8BF5', textAlign: 'center' }}>{title}</Text>
  </TouchableOpacity>)
};

export default RoundedButton