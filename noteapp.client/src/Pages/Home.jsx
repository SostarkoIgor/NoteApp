import { useNavigate, useParams } from 'react-router-dom'
import {AuthData} from '../Components/Authorize.jsx';
import { useContext, useState, useEffect } from 'react'
import ReactComponent from '../Components/ReactComponent.jsx'
import '../Styles/Home.css'
import SmallNote from '../Components/SmallNote.jsx';

function Home() {
    const navigate=useNavigate()
    const userData=useContext(AuthData)
    const [notes, setNotes]=useState([])
    const [error, setError] = useState("")
    const { email } = useParams()

    useEffect(() => {
        async function start() {
            setError("")
            let user=email?email:""
            try {
                let resp = await fetch("/api/note/getusernotes"+user, {
                    method: "GET"
                })

                if (resp.status == 200) {
                    let j = await resp.json()
                    setNotes(j)
                }
                else {
                    console.log(resp.status)
                    setError("Error getting notes from server ("+resp.status+")")
                }
            }
            catch (e) {
                console.log(e)
                setError("Error getting notes from server ("+e+")")
            }
        }

        start()
    }, [])
    return (
        <>
        {error==="" && notes.map((note, index) => (
            <SmallNote key={index} index={note.id} image={note.image} title={note.title} datecr={note.dateCreated} dateedit={note.DateUpdated}/>
        ))}
            {error != "" && <p>{error}</p>}
        </>
    )
}

export default Home;