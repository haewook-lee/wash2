import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, StyleSheet, Pressable } from 'react-native';
import 'firebase/firestore'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig'
import { useUser } from './UserContext';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc, FieldValue, increment } from "firebase/firestore"; 
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
  // let [upvote, setUpvote] = useState(markerData.upvote)
  // let [downvote, setDownvote] = useState(markerData.downvote)

  const washroomsRef = collection(FIRESTORE_DB, 'washrooms')
  const votesRef = collection(FIRESTORE_DB, 'votes')

  const w = query(washroomsRef, where('id', '==', markerData.id))

  const user = useUser()

  // Upvote a washroom
  const upvoteWashroom = async (userId?: UserContextType) => {
    const q = query(votesRef, where('washroomId', '==', markerData.id), where('uid', '==', userId?.user?.uid))

    console.log(userId?.user?.uid, markerData.id)

    try {
      const querySnapshot = await getDocs(q);
      const washroomSnapshot = await getDocs(w)
      const washRef = doc(washroomsRef, washroomSnapshot.docs[0].id)
      console.log('hi', washRef)
  
      if (!querySnapshot.empty) {
        const matchingVote = querySnapshot.docs[0].data()
        console.log('Matching vote:', matchingVote, querySnapshot.docs[0].id);
        const docRef = doc(votesRef, querySnapshot.docs[0].id)
        

        if(matchingVote.vote === 'upvote'){
          await deleteDoc(docRef)

          await updateDoc(washRef, {
            upvote: increment(-1)
          })
          
        } else if(matchingVote.vote === 'downvote') {
          await updateDoc(docRef, {
            vote: 'upvote'
          })

          // await updateDoc(washRef, {
          //   upvote: increment(1),
          //   downvote: increment(-1)
          // })
        }
      } else {
        const newDoc = await addDoc(votesRef, {
          washroomId: markerData.id,
          uid: userId?.user?.uid,
          vote: 'upvote'
        })

        await updateDoc(washRef, {
          upvote: increment(1)
        })

        console.log('Document written with ID: ', newDoc.id)
      }
    } catch (error) {
      console.error('Error querying documents:', error);
    }

    onClose()
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

        const docRef = doc(votesRef, querySnapshot.docs[0].id)

        if(matchingVote.vote === 'downvote'){
          await deleteDoc(docRef)

        } else if(matchingVote.vote === 'upvote') {
          await updateDoc(docRef, {
            vote: 'downvote'
          })

        }
      } else {
        const newDoc = await addDoc(votesRef, {
          washroomId: markerData.id,
          uid: userId?.user?.uid,
          vote: 'downvote'
        })

        console.log('Document written with ID: ', newDoc.id)
      }
    } catch (error) {
      console.error('Error querying documents:', error);
    }

    onClose()
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
            <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Upvote:</Text> {markerData.upvote}</Text>
            <Text style={styles.description}><Text style={{fontWeight: 'bold'}}>Downvote:</Text> {markerData.downvote}</Text>

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