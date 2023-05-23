import { useContext } from 'react';
import { AuthContext } from '../../contexts/Auth.context';
import Menu from '../menu/Menu';

const Header = () => {
	const { currentUser } = useContext(AuthContext);
	return (
		<header>
			<p>
				{currentUser
					? 'Hay usuario con id: ' + currentUser.uid
					: 'No hay usuario'}
			</p>
			<Menu />
		</header>
	);
};
export default Header;
