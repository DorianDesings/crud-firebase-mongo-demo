import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { auth } from '../config/firebase.config';
import { AuthContext } from '../contexts/Auth.context';

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [refetchCounter, setRefetchCounter] = useState(0);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async user => {
			if (user) {
				// El usuario está autenticado
				await getUserInfoFromMongo(
					user,
					setCurrentUser,
					refetchCounter,
					setRefetchCounter
				);
			} else {
				// El usuario no está autenticado
				setCurrentUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const socket = io('http://localhost:4000');

		socket.on('collectionChange', change => {
			switch (change.operationType) {
				case 'update':
					console.log('UPDATE USER', currentUser);
					setCurrentUser(prevUser => ({
						...prevUser,
						...change.updateDescription.updateFields
					}));
					break;
				default:
					break;
			}
		});

		socket.emit('startCollectionListener');

		return () => {
			socket.disconnect();
		};
	}, []); // Agrega currentUser como dependencia del useEffect

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);
};

const getUserInfoFromMongo = async (
	user,
	setCurrentUser,
	attempts,
	setRefetchCounter
) => {
	console.log('GET USER INFO', user);
	try {
		const response = await fetch(`http://localhost:3000/users/${user.uid}`);
		if (response.ok) {
			const userInfo = await response.json();
			setCurrentUser({ ...user, ...userInfo });
		} else {
			throw new Error('Error al obtener la información del usuario');
		}
	} catch (error) {
		if (attempts < 5) {
			// Intenta nuevamente después de un tiempo
			setTimeout(
				() =>
					getUserInfoFromMongo(
						user,
						setCurrentUser,
						attempts + 1,
						setRefetchCounter
					),
				1000
			);
		} else {
			setRefetchCounter(prevCounter => prevCounter + 1);
		}
	}
};
