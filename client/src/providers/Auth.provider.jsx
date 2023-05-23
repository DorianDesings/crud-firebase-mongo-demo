import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { auth } from '../config/firebase.config';
import { AuthContext } from '../contexts/Auth.context';

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [attemps, setAttemps] = useState(0);

	console.log(currentUser);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async user => {
			if (user) {
				// El usuario está autenticado
				console.log('FIREBASE USER', user);
				await getUserInfoFromMongo(user, setCurrentUser, attemps, setAttemps);
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
					console.log('CHANGE', change);
					console.log(currentUser);
					// setCurrentUser(prevUser => ({
					// 	...prevUser,
					// 	...change.updateDescription.updateFields
					// }));
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
	setAttemps
) => {
	try {
		const response = await fetch(`http://localhost:3000/users/${user.uid}`);
		if (response.ok) {
			const userInfo = await response.json();
			setCurrentUser({
				...user,
				...userInfo
			});
		} else {
			throw new Error('Error al obtener la información del usuario');
		}
	} catch (error) {
		if (attempts < 5) {
			// Intenta nuevamente después de un tiempo
			setTimeout(
				() =>
					getUserInfoFromMongo(user, setCurrentUser, attempts + 1, setAttemps),
				1000
			);
		} else {
			setAttemps(prevCounter => prevCounter + 1);
		}
	}
};
