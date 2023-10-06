import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const accessibleImage = require('../../assets/accessible.png')
const unisexImage = require('../../assets/unisex.png')
const tableImage = require('../../assets/table.png')


interface CustomCalloutProps {
  title: string;
  description: string;
  accessible?: any;
  unisex?: boolean;
  table?: boolean;
  upvote?: number;
  downvote?: number;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({ title, description, accessible, unisex, table, upvote, downvote }) => {
  const characteristics = accessible || unisex || table

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {characteristics && (
        <View style={styles.imageContainer}>
            {accessible && (<Image source={accessibleImage} style={{ width: 24, height: 24 }}/>)}
            {unisex && (<Image source={unisexImage} style={{ width: 24, height: 24 }}/>)}
            {table && (<Image source={tableImage} style={{ width: 24, height: 24 }}/>)}
        </View>
      )}
      <Text>Upvote; Downvote</Text>
      <Text>More...</Text>
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
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default CustomCallout;