import React from 'react';
import { View, Text, Modal, Button, StyleSheet, Pressable } from 'react-native';

interface CustomPopupProps {
  visible: boolean;
  onClose: () => void;
  markerData: { 
    title: string;
    description: string;
    accessible?: boolean;
    unisex?: boolean;
    table?: boolean;
    upvote?: number;
    downvote?: number;
    comment?: string
  };
}

const CustomPopup: React.FC<CustomPopupProps> = ({ visible, onClose, markerData }) => {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.popupContainer}>
        <View style={styles.popupContent}>
          <Text>{markerData.title}</Text>
          <Text>{markerData.description}</Text>
          <Text>{markerData.accessible}</Text>
          <Text>{markerData.unisex}</Text>
          <Text>{markerData.upvote}</Text>
          <Pressable onPress={onClose} style={styles.popupButton}>
            <Text style={styles.buttonText}>
                Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: 250
  },
  popupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default CustomPopup;