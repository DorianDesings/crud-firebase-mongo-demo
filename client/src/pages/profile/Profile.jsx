import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase.config';
import { AuthContext } from '../../contexts/Auth.context';
import { useFetch } from '../../hooks/useFetch';

const Profile = () => {
	const { currentUser, firebaseLoading } = useContext(AuthContext);

	const navigate = useNavigate();

	const { setFetchInfo } = useFetch();

	if (!currentUser && !firebaseLoading) return <Navigate to='/' />;

	return (
		<>
			<h1>Profile</h1>
			<form onSubmit={e => updateUser(e, setFetchInfo, currentUser, navigate)}>
				<input type='submit' value='PRUEBA FINAL' />
			</form>
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

const updateUser = async (e, setFetchInfo, currentUser, navigate) => {
	e.preventDefault();

	const newInfo = {
		username: 'dfgd'
	};
	try {
		await setFetchInfo({
			url: 'http://localhost:3000/users/' + currentUser.uid,
			options: {
				method: 'PATCH',
				body: JSON.stringify(newInfo),
				headers: {
					Accept: '*/*',
					'Content-Type': 'application/json'
				}
			}
		});
	} catch (err) {
		console.log(err);
	}

	navigate('/');
};

export default Profile;
