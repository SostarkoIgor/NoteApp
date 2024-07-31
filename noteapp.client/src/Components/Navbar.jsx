import { useContext } from 'react';
import '../Styles/Navbar.css'
import { AuthData } from './Authorize.jsx'
import { useNavigate } from 'react-router-dom'
import Logout from './LogoutLink.jsx'
import LogoutLink from './LogoutLink.jsx';
function Navbar() {
  const userData=useContext(AuthData)
  const navigate=useNavigate()
  return (
    <div className='nav-bar'>
        <div className='nav-title'>
            <h3>NoteApp</h3>
        </div>
        <div className='nav-links'>
            <a className='nav-link' onClick={()=>navigate('/publicnotes')}>Notes shared with me</a>
            <a className='nav-link' onClick={()=>window.location.href = '/'}>My notes</a>
            <a className='nav-link' onClick={() => window.location.href = '/createeditnote'}>Create note</a>
            <LogoutLink className='nav-link'>Logout {userData}</LogoutLink>
        </div>
    </div>
  );
}

export default Navbar;