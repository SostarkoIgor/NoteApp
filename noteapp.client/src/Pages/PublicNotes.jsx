import { useNavigate, useParams } from 'react-router-dom'
import {AuthData} from '../Components/Authorize.jsx';
import { useContext, useState, useEffect } from 'react'
import styles from '../Styles/Home.module.css'
import SmallNote from '../Components/SmallNote.jsx';
import Loader from '../Components/Loader.jsx'

function PublicNotes() {
    const navigate=useNavigate()
    const userData=useContext(AuthData)
    const [notes, setNotes]=useState()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

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
            finally {
                setLoading(false)
            }
            setLoading(false)
        }

        start()
    }, [])
    if (loading) {
        return <div className={styles.centeringcontainer}><Loader /></div>
    }
    else if (notes.length===0){
        return <div className={styles.centeringcontainer}><p className={styles.nonotesfound}>No notes found</p></div>
    }
    else
    return (
        <div className={styles.container}>
        {notes!=undefined && error==="" && notes.map((note, index) => (
            <SmallNote key={index} index={note.id} image={note.image} title={note.title} datecr={note.dateCreated} dateedit={note.dateUpdated}/>
        ))}
            {error != "" && <p>{error}</p>}
        </div>
    )
}

export default PublicNotes;