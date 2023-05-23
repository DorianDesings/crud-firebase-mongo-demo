import { useContext } from 'react';
import { AuthContext } from '../../contexts/Auth.context';
import { useFetch } from '../../hooks/useFetch';

const Home = () => {
	const { currentUser } = useContext(AuthContext);

	const {
		data: books,
		loading: loadingBooks,
		error: errorBooks
	} = useFetch({ url: 'http://localhost:3000/books' });

	if (loadingBooks) return <h1>Loading...</h1>;
	if (errorBooks) return <h1>Somethig went wrong!!</h1>;

	if (books.length === 0) return <h1>Nothing to show!</h1>;

	return books.map(book => (
		<div key={book._id}>
			<h2>{book.title}</h2>
			{currentUser && book.userEmail === currentUser.email && (
				<button>ES MIO</button>
			)}
			{currentUser && <h2>Username: {currentUser.username}</h2>}
		</div>
	));
};

export default Home;
