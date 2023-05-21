import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup
} from 'firebase/auth';

import { useContext, useState } from 'react';

import { Navigate } from 'react-router-dom';
import { auth } from '../../config/firebase.config';
import { AuthContext } from '../../contexts/Auth.context';

const Login = () => {
	const { currentUser, firebaseLoading } = useContext(AuthContext);

	const [loginData, setLoginData] = useState({
		email: '',
		password: ''
	});

	const [error, setError] = useState('');

	if (currentUser) return <Navigate to='/' />;

	if (firebaseLoading) return <h1>Loading...</h1>;

	if (error) return <h1>Somethig went wrong!!</h1>;

	return (
		<>
			<h1>Login</h1>
			{error && <p>{error}</p>}
			<form onSubmit={e => handleSubmit(e, loginData, setError)}>
				<div>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						id='email'
						onChange={e =>
							setLoginData({ ...loginData, email: e.target.value })
						}
					/>
				</div>
				<div>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						onChange={e =>
							setLoginData({ ...loginData, password: e.target.value })
						}
					/>
				</div>
				<input type='submit' value='Sign In' />
			</form>

			<button onClick={loginWithGoogle}>Iniciar sesión con Google</button>
		</>
	);
};

const handleSubmit = async (e, loginData, setError) => {
	e.preventDefault();
	const { email, password } = loginData;
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (err) {
		setError('INVALID EMAIL');
	}
};

const loginWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	try {
		const result = await signInWithPopup(auth, provider);
		console.log(result);
	} catch (err) {
		console.log(err);
	}
};

export default Login;
