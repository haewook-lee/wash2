import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { DocumentData, collection, doc, getDocs } from "firebase/firestore"; 
import { FIRESTORE_DB } from '../../FirebaseConfig';

interface MarkerData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  directions: string;
}

export default function Map() {
  const [markers, setMarkers] = useState<DocumentData[]>([]);

  const washroomsRef = collection(FIRESTORE_DB, 'washroom')

  useEffect(() => {

    // Fetch data from Firestore and update markers state
    const fetchData = async () => {
      try {
        // const q = query(collection(db, "cities"), where("capital", "==", true)); // example of conditional query
        const querySnapshot = await getDocs(washroomsRef)
        const data = querySnapshot.docs.map((d) => ({ 
          id: d.id, 
          ...d.data() 
        }))

        setMarkers(data);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ latitude: 36.8712433, longitude: -76.4412966, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
            description={marker.directions}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});