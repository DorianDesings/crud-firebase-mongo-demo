import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { auth } from '../config/firebase.config';
import { AuthContext } from '../contexts/Auth.context';

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [refetchCounter, setRefetchCounter] = useState(0);

	useEffect(() => {
		const unsuscribre = auth.onAuthStateChanged(user => {
			if (user) {
				// El usuario está autenticado
				getUserInfoFromMongo(
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

		return () => unsuscribre();
	}, []);

	useEffect(() => {
		const socket = io('http://localhost:4000'); // Establece la conexión del socket

		// Maneja el evento de cambio en la colección
		socket.on('collectionChange', change => {
			switch (change.operationType) {
				case 'update':
					console.log('UPADATE USER', currentUser);

					break;

				default:
					break;
			}
		});

		// Solicita iniciar la escucha de cambios en la colección
		socket.emit('startCollectionListener');
		// Limpia la conexión del socket al desmontar el componente
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);
};

const getUserInfoFromMongo = async (
	user,
	setCurrentUser,
	refetchCounter,
	setRefetchCounter
) => {
	const response = await fetch(`http://localhost:3000/users/${user.uid}`);
	if (!response.ok && refetchCounter < 5) {
		setRefetchCounter(refetchCounter + 1);
		getUserInfoFromMongo(user, setCurrentUser);
	}
	const userInfo = await response.json();
	setCurrentUser({ ...user, ...userInfo });
};
