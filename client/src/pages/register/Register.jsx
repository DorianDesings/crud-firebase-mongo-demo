import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../config/firebase.config';
import { AuthContext } from '../../contexts/Auth.context';
import { useFetch } from '../../hooks/useFetch';

const Register = () => {
	const {
		data: allUsers,
		loading,
		error,
		setFetchInfo
	} = useFetch({
		url: 'http://localhost:3000/users'
	});
	const { currentUser } = useContext(AuthContext);

	const [registerData, setRegisterData] = useState({
		username: '',
		email: '',
		password: ''
	});

	if (currentUser) return <Navigate to='/' />;

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Somethig went wrong!!</h1>;

	return (
		<>
			<h1>Register</h1>
			<form
				onSubmit={e => handleSubmit(e, allUsers, registerData, setFetchInfo)}
			>
				<div>
					<label htmlFor='username'>Username</label>
					<input
						type='text'
						id='username'
						onChange={e =>
							setRegisterData({ ...registerData, username: e.target.value })
						}
					/>
				</div>
				<div>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						id='email'
						onChange={e =>
							setRegisterData({ ...registerData, email: e.target.value })
						}
					/>
				</div>
				<div>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						onChange={e =>
							setRegisterData({ ...registerData, password: e.target.value })
						}
					/>
				</div>
				<input type='submit' value='Sign Up' />
			</form>
		</>
	);
};

const handleSubmit = async (e, allUsers, registerData, setFetchInfo) => {
	e.preventDefault();
	const { username, email, password } = registerData;
	if (allUsers.length !== 0) {
		const usernameExist = allUsers.some(user => user.username === username);
		const userEmailExist = allUsers.some(user => user.email === email);
		if (usernameExist) {
			console.log('El nombre de usuario ya existe');
			return;
		}
		if (userEmailExist) {
			console.log('El nombre de usuario ya existe');
			return;
		}
	}
	try {
		const newUserInfo = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		registerData._id = newUserInfo.user.uid;

		await setFetchInfo({
			url: 'http://localhost:3000/users',
			options: {
				method: 'POST',
				body: JSON.stringify(registerData),
				headers: {
					Accept: '*/*',
					'Content-Type': 'application/json'
				}
			}
		});
	} catch (err) {
		console.log(err);
	}
};

export default Register;
