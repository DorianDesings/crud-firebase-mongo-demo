import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { auth } from '../config/firebase.config';
import { AuthContext } from '../contexts/Auth.context';

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [attempts, setAttempts] = useState(0);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async user => {
			if (user) {
				// El usuario está autenticado
				await getUserInfoFromMongo(user, setCurrentUser, attempts, setAttempts);
			} else {
				// El usuario no está autenticado
				setCurrentUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const socket = io('http://localhost:4000');

		socket.on('collectionUsersChange', async change => {
			switch (change.operationType) {
				case 'update':
					await getUserInfoFromMongo(
						currentUser,
						setCurrentUser,
						attemps,
						setAttemps
					);
					break;
				default:
					break;
			}
		});

		socket.emit('startCollectionListener');

		return () => {
			socket.disconnect();
		};
	}, [currentUser]); // Agrega currentUser como dependencia del useEffect

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
	setAttempts
) => {
	try {
		const response = await fetch(`http://localhost:3000/users/${user.uid}`);
		if (response.ok) {
			const userInfo = await response.json();
			setCurrentUser({
				...user,
				...userInfo
			});
			setAttempts(0);
		} else {
			throw new Error('Error al obtener la información del usuario');
		}
	} catch (error) {
		if (attempts < 5) {
			// Intenta nuevamente después de un tiempo
			setTimeout(
				() =>
					getUserInfoFromMongo(user, setCurrentUser, attempts + 1, setAttempts),
				1000
			);
		}
	}
};
