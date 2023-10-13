import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, StyleSheet, Pressable } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore'
import { FIREBASE_AUTH } from '../../FirebaseConfig'

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
    comment?: string;
    id?: number;
  };
}

const CustomPopup: React.FC<CustomPopupProps> = ({ visible, onClose, markerData }) => {
  const [userVoted, setUserVoted] = useState(false)

  const auth = FIREBASE_AUTH

  const checkUserVote = async () => {
    // const userId = firebase.auth().currentUser?.uid
  }

  useEffect(() => {
    checkUserVote()
  })

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.popupBg}>
        <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
            <Text style={styles.title}>{markerData.title}</Text>
            <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Accessible?</Text> {markerData.accessible ? `Yes` : `No`}</Text>
            <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Unisex?</Text> {markerData.unisex ? `Yes` : `No`}</Text>
            <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Changing Table?</Text> {markerData.table ? `Yes` : `No`}</Text>
            {markerData.description && <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Directions:</Text> {markerData.description}</Text>}
            {markerData.comment && <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Comments:</Text> {markerData.comment}</Text>}
            <Pressable onPress={onClose} style={styles.popupButton}>
                <Text style={styles.buttonText}>
                    Close
                </Text>
            </Pressable>
            </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%'
  },
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
},
description: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 3,
},
});

export default CustomPopup;