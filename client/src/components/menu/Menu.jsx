import { NavLink } from 'react-router-dom';
import { StyledMenu } from './styles';

const Menu = () => {
	return (
		<nav>
			<StyledMenu>
				<li>
					<NavLink to='/'>Home</NavLink>
				</li>
				<li>
					<NavLink to='/login'>Login</NavLink>
				</li>
				<li>
					<NavLink to='/register'>Register</NavLink>
				</li>

				<li>
					<NavLink to='/profile'>Profile</NavLink>
				</li>
			</StyledMenu>
		</nav>
	);
};

export default Menu;
