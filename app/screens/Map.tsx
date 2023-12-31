import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { DocumentData, collection, doc, getDocs, onSnapshot, query } from "firebase/firestore"; 
import { FIRESTORE_DB } from '../../FirebaseConfig';
import * as Location from 'expo-location';
import CustomPopup from '../components/CustomPopup';
import { useUser } from '../components/UserContext';
import RoundedButton from '../components/RoundedButton';

interface userLoc {
  latitude: number;
  longitude: number
}

export default function Map() {
  let [markers, setMarkers] = useState<DocumentData[]>([]);
  let [filteredMarkers, setFilteredMarkers] = useState<DocumentData[]>([])
  let [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [userLocation, setUserLocation] = useState<userLoc | null>(null)

  const [popupVisible, setPopupVisible] = useState(false);
  let [selectedMarker, setSelectedMarker] = useState<{ title: string; description: string; id: string } | null>(null);

  const washroomsRef = collection(FIRESTORE_DB, 'washrooms')

  const user = useUser()

  console.log('map room', user?.user?.uid)

  let showPopup = (
    marker: { 
      title: string;
      description: string;
      accessible?: any;
      unisex?: boolean;
      table?: boolean;
      upvote?: number;
      downvote?: number; 
      comment?: string;
      id: string;
    }) => {
    setSelectedMarker(marker);
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setSelectedMarker(null);
    setPopupVisible(false);
  };

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
        setFilteredMarkers(data)

        const updateSnapshot = onSnapshot(washroomsRef, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if(change.type === "modified"){
              
              const modifiedMarker = change.doc.data()

              // updated filtered markers
              const updatedFilteredMarkers = filteredMarkers.map(marker => 
                marker.id === modifiedMarker.id ? modifiedMarker : marker
              )

              setFilteredMarkers(updatedFilteredMarkers)

              // updated markers
              const updatedMarkers = markers.map(marker =>
                marker.id === modifiedMarker.id ? modifiedMarker : marker
              );

              setMarkers(updatedMarkers);
            }
          })
        })
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

  useEffect(() => {
    if(selectedFilters.length === 0){
      setFilteredMarkers(markers)
    } else {
      let filtered = markers.filter((marker) => {
        return selectedFilters.every((filter) => marker[filter])
      });
      setFilteredMarkers(filtered);
    }
  }, [selectedFilters, markers])

  const handleFilter = (property: string) => {
    const updatedFilters = selectedFilters.includes(property)
      ? selectedFilters.filter((filter) => filter !== property)
      : [...selectedFilters, property];

    setSelectedFilters(updatedFilters);
  };

  return (
    <View style={styles.container}>
      {userLocation &&
      <MapView style={styles.map} initialRegion={{ latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.name}
            pinColor="red"
            onPress={() => showPopup({ 
              title: marker.name,
              description: marker.directions,
              accessible: marker.accessible,
              unisex: marker.unisex,
              table: marker.changing_table,
              upvote: marker.upvote,
              downvote: marker.downvote,
              comment: marker.comment,
              id: marker.id
            })}
          />
        ))}
      </MapView>}

      <View style={{ 
        position: 'absolute', 
        top: 20, 
        left: 10, 
        right: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        backgroundColor: 'transparent',
        borderRadius: 10 
        }}
      >
        <RoundedButton onPress={() => handleFilter('accessible')} title="Accessible" />
        <RoundedButton onPress={() => handleFilter('changing_table')} title="Changing Tables" />
        <RoundedButton onPress={() => handleFilter('unisex')} title="Unisex" />
      </View>

      <CustomPopup visible={popupVisible} onClose={hidePopup} markerData={selectedMarker || { title: '', description: '', id: '' }} />
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