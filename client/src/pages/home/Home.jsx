import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/Auth.context';
import { useFetch } from '../../hooks/useFetch';

const Home = () => {
	const { currentUser } = useContext(AuthContext);

	const {
		data: books,
		loading: loadingBooks,
		error: errorBooks
	} = useFetch({ url: 'http://localhost:3000/books' });

	const { data: userData, setFetchInfo: getUserInfo } = useFetch();

	useEffect(() => {
		if (!currentUser) return;
		getUserInfo({ url: `http://localhost:3000/users/${currentUser.uid}` });
	}, [currentUser]);

	if (loadingBooks) return <h1>Loading...</h1>;
	if (errorBooks) return <h1>Somethig went wrong!!</h1>;

	if (books.length === 0) return <h1>Nothing to show!</h1>;

	console.log(userData);

	return books.map(book => (
		<div key={book._id}>
			<h2>{book.title}</h2>
			{book.userEmail === userData?.email && <button>ES MIO</button>}
		</div>
	));
};

const sumNumbers = (a, b) => a + b;

const data1 = sumNumbers(1, 3);

const data2 = sumNumbers(5, 8);

console.log(data1, data2);

export default Home;
