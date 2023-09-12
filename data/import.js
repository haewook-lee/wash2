const admin = require('firebase-admin');

const serviceAccount = require('../firebaseAPIkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const fs = require('fs');

// Read the JSON data from your file
const rawData = fs.readFileSync('./dataset/output-2.json');
const jsonData = JSON.parse(rawData);

// Define the Firestore collection where you want to import the data
const collectionName = 'washrooms';

// Iterate over the JSON data and add each document to Firestore
jsonData.forEach(async (data) => {
  try {
    const docRef = await db.collection(collectionName).add(data);
    console.log(`Document added with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding document:', error);
  }
});