import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface UserContextType {
  user: User | null;
}

// export const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserContext = createContext<any>('1');

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // throw new Error('useUser must be used within a UserProvider');
    return 'hello world'
  } 
  return context;
};

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)
  const value = { user }

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user)
      setUser(user)
    })
  }, [])

  return <UserContext.Provider value={{user : 'hello'}}>{children}</UserContext.Provider>;
//   return <UserContext.Provider value={{user : user}}>{children}</UserContext.Provider>;
};