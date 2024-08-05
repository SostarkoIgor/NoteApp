import { useContext, useState } from 'react';
import styles from '../Styles/Navbar.module.css'
import { AuthData } from './Authorize.jsx'
import { useNavigate } from 'react-router-dom'
import Logout from './LogoutLink.jsx'
import LogoutLink from './LogoutLink.jsx';
function Navbar() {
  const userData=useContext(AuthData)
  const navigate=useNavigate()
  const [displaydropdown, setdisplaydropdown] = useState(false)
  return (
    <div className={styles.navbar}>
        <div className={styles.navtitle}>
            <h3>NoteApp</h3>
        </div>
        <div className={styles.dropdown} onClick={()=>setdisplaydropdown(!displaydropdown)}>
          <div className={styles.dropdownbtnel}></div>
          <div className={styles.dropdownbtnel}></div>
          <div className={styles.dropdownbtnel}></div>
        </div>
        <ul className={`${styles.navlinks} ${displaydropdown?styles.navlinksactive:""}`}>
            <li><a className={styles.navlink} onClick={()=>navigate('/publicnotes')}>Notes shared with me</a></li>
            <li><a className={styles.navlink} onClick={()=>window.location.href = '/'}>My notes</a></li>
            <li><a className={styles.navlink} onClick={() => window.location.href = '/createeditnote'}>Create note</a></li>
            <li><LogoutLink className={styles.logoutlink}>Logout <a className={styles.username}>{userData}</a></LogoutLink></li>
        </ul>
    </div>
  );
}

export default Navbar;