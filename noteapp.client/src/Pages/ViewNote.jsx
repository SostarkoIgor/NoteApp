import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from '../Styles/ViewNote.module.css'
import Loader from "../Components/Loader.jsx"
function ViewNote(){
    const { id } = useParams()
    const [note, setNote] = useState(null)
    const [errorMsg, setErrorMsg] = useState("")
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        async function start() {
            setErrorMsg("")
            try{
            let resp=await fetch("/api/Note/getnotebyid/"+id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                if (resp.status==200) {
                    let note=await resp.json()
                    console.log(note)
                    setNote(note)
                }
            
            }
            catch(e) {
                console.log(e)
                setErrorMsg("Error getting note from server ("+e+")")
            }
            finally {
                setLoading(false)
            }
        }
        start();
        
    }, [])
    if (loading) {
        return (<Loader/>)
    }else
    return(
    <>
    <div className={styles.container}>
        <div className={styles.note}>
        <p className={styles.title}>Title:</p>
        <h1 className={styles.viewnotetitle}>{note?.title}</h1>
        <p className={styles.text}>Text:</p>
        <p className={styles.viewnotetext}>{note?.text}</p>
        
        <p className={styles.text}>Image:</p>
        {note.image==null || note.image==""?<p className={styles.noimg}>No image</p>:
        <img className={styles.viewnoteimg} src={"https://localhost:7107/"+note?.image} alt="No image"/>}
        <p className={styles.viewnotedate}><span className={styles.datetxt}>Created:</span> {(new Date(note?.dateCreated)).toISOString().replace('T', ' ').slice(0, 19)}</p>
        <p className={styles.viewnotedate}><span className={styles.datetxt}>Edited:</span> {note?.dateUpdated?(new Date(note?.dateUpdated)).toISOString().replace('T', ' ').slice(0, 19):"Never"}</p>
        <button className={styles.editnote} onClick={() => navigate("/createeditnote/" + id)}>Edit</button>
        </div>
    </div>
    </>)

}

export default ViewNote