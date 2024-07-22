import { useContext } from 'react';
import '../Styles/Navbar.css'
import { AuthData } from './Authorize.jsx'
import { Navigate } from 'react-router-dom'
import Logout from './LogoutLink.jsx'
import LogoutLink from './LogoutLink.jsx';
function Navbar() {
  const userData=useContext(AuthData)
  return (
    <div className='nav-bar'>
        <div className='nav-title'>
            <h3>NoteApp</h3>
        </div>
        <div className='nav-links'>
            <a className='nav-link' href='/'>Public notes</a>
            <a className='nav-link' href='/'>My notes</a>
            <a className='nav-link' href='/'>Profile {userData}</a>
            <LogoutLink className='nav-link'>Logout</LogoutLink>
        </div>
    </div>
  );
}

export default Navbar;