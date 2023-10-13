import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login'
import List from './app/screens/List';
import Details from './app/screens/Details';
import Map from './app/screens/Map';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { useUser, UserProvider } from './app/components/UserContext'

const Stack = createNativeStackNavigator()

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Washrooms Map" component={Map} />
      <InsideStack.Screen name="List" component={List} />
      <InsideStack.Screen name="Details" component={Details} />
    </InsideStack.Navigator>
  )
}

export default function App() {
  const user = useUser()

  return (
    <UserProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Inside' : 'Login'}>
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false}} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

