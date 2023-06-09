// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCqeDLq2j-55DwLItpyG_I2A06hGnhtm5M',
	authDomain: 'crud-firebase-eed75.firebaseapp.com',
	databaseURL: 'https://crud-firebase-eed75-default-rtdb.firebaseio.com',
	projectId: 'crud-firebase-eed75',
	storageBucket: 'crud-firebase-eed75.appspot.com',
	messagingSenderId: '554886206062',
	appId: '1:554886206062:web:68f037bb9850a87da98c7f'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);
