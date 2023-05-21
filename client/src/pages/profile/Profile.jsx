import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../config/firebase.config';
import { AuthContext } from '../../contexts/Auth.context';

const Profile = () => {
	const { currentUser, firebaseLoading } = useContext(AuthContext);

	if (!currentUser && !firebaseLoading) return <Navigate to='/' />;

	return (
		<>
			<h1>Profile</h1>
			<button
				onClick={() => {
					auth.signOut();
				}}
			>
				Sign Out
			</button>
		</>
	);
};

export default Profile;
