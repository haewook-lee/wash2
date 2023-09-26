import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { DocumentData, collection, doc, getDocs } from "firebase/firestore"; 
import { FIRESTORE_DB } from '../../FirebaseConfig';
import * as Location from 'expo-location';

interface MarkerData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  directions: string;
}

interface userLoc {
  latitude: number;
  longitude: number
}

export default function Map() {
  const [markers, setMarkers] = useState<DocumentData[]>([]);
  const [userLocation, setUserLocation] = useState<userLoc | null>(null)

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

  useEffect(() => {
    // Fetch user's location
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {userLocation &&
      <MapView style={styles.map} initialRegion={{ latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
        {/* user marker */}
        <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
            description={marker.directions}
          />
        ))}
      </MapView>}
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