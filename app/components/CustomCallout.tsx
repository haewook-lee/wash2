import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomCalloutProps {
  title: string;
  description: string;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({ title, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* <Text style={styles.description}>{description}</Text>
      <Text style={styles.description}>Hello friends, i am a test</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      description: {
        fontSize: 14,
        textAlign: 'center',
      },
});

export default CustomCallout;