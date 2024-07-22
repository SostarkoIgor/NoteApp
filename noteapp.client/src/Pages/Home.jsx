import { useNavigate } from 'react-router-dom'
import Authorize from '../Components/Authorize.jsx';
import { useContext } from 'react'
import ReactComponent from '../Components/ReactComponent.jsx'
import '../Styles/Home.css'

function Home() {
    const navigate=useNavigate()
    return (
        <Authorize>
            <ReactComponent></ReactComponent>
        </Authorize>
    )
}

export default Home;