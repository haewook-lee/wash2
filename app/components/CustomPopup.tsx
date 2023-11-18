import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, StyleSheet, Pressable } from 'react-native';
import 'firebase/firestore'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig'
import { useUser } from './UserContext';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"; 
import { UserContextType } from './UserContext';

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
    id: string;
  };
}

const CustomPopup: React.FC<CustomPopupProps> = ({ visible, onClose, markerData }) => {

  const washroomsRef = collection(FIRESTORE_DB, 'washrooms')
  const votesRef = collection(FIRESTORE_DB, 'votes')

  const user = useUser()

  const checkUserVote = async () => {
    // const userId = firebase.auth().currentUser?.uid
  }

  useEffect(() => {
    checkUserVote()
  })

    // Upvote a washroom
  const upvoteWashroom = async (userId?: UserContextType) => {
    const q = query(votesRef, where('washroomId', '==', markerData.id), where('uid', '==', `${userId?.user?.uid}`))
    console.log(userId?.user?.uid, markerData.id)

    try {
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const matchingVote = querySnapshot.docs[0].data()
        console.log('Matching vote:', matchingVote);
      } else {
        const newDoc = await addDoc(votesRef, {
          washroomId: markerData.id,
          uid: userId?.user?.uid,
          vote: 'upvote'
        })

        console.log('Document written with ID: ', newDoc.id)

        // update the washroom upvotes/downvotes
      }
    } catch (error) {
      console.error('Error querying documents:', error);
    }
  };

  // Downvote a washroom
  const downvoteWashroom = async (userId?: UserContextType) => {
    const q = query(votesRef, where('washroomId', '==', markerData.id), where('uid', '==', `${userId?.user?.uid}`))
    console.log(userId?.user?.uid, markerData.id)

    try {
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const matchingVote = querySnapshot.docs[0].data()
        console.log('Matching vote:', matchingVote);
      } else {
        const newDoc = await addDoc(votesRef, {
          washroomId: markerData.id,
          uid: userId?.user?.uid,
          vote: 'downvote'
        })

        console.log('Document written with ID: ', newDoc.id)

        // update the washroom upvotes/downvotes
      }
    } catch (error) {
      console.error('Error querying documents:', error);
    }
  };

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
            <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Upvote:</Text> 0</Text>
            <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Downvote:</Text> 0</Text>

            <Pressable onPress={() => upvoteWashroom(user)} style={styles.popupButton}>
              <Text style={styles.buttonText}>
                Upvote
              </Text>
            </Pressable>
            <Pressable onPress={() => downvoteWashroom(user)} style={styles.popupButton}>
              <Text style={styles.buttonText}>
                Downvote
              </Text>
            </Pressable>

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