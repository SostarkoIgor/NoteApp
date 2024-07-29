import { useNavigate, useParams } from 'react-router-dom'
import {AuthData} from '../Components/Authorize.jsx';
import { useContext, useState, useEffect } from 'react'
import '../Styles/Home.css'
import SmallNote from '../Components/SmallNote.jsx';

function PublicNotes() {
    const navigate=useNavigate()
    const userData=useContext(AuthData)
    const [notes, setNotes]=useState()
    const [error, setError] = useState("")

    useEffect(() => {
        async function start() {
            setError("")
            try {
                let resp = await fetch("/api/note/getnotessharedwithuser/", {
                    method: "GET"
                })

                if (resp.status == 200) {
                    let j = await resp.json()
                    console.log(j)
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
        {notes===undefined && <p>Loading...</p>}
        {notes!=undefined && error==="" && notes.map((note, index) => (
            <SmallNote key={index} index={note.id} image={note.image} title={note.title} datecr={note.dateCreated} dateedit={note.dateUpdated}/>
        ))}
            {error != "" && <p>{error}</p>}
        </>
    )
}

export default PublicNotes;