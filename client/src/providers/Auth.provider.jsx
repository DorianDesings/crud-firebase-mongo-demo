import { useEffect, useState } from 'react';
import { auth } from '../config/firebase.config';
import { AuthContext } from '../contexts/Auth.context';

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [firebaseLoading, setFirebaseLoading] = useState(true);

	useEffect(() => {
		const unsuscribre = auth.onAuthStateChanged(user => {
			if (user) {
				// El usuario está autenticado
				setCurrentUser(user);
			} else {
				// El usuario no está autenticado
				setCurrentUser(null);
			}
			setFirebaseLoading(false);
		});

		return () => unsuscribre();
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, firebaseLoading }}>
			{children}
		</AuthContext.Provider>
	);
};
