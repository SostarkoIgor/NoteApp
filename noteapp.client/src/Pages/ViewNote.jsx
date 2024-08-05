import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from '../Styles/ViewNote.module.css'
function ViewNote(){
    const { id } = useParams()
    const [note, setNote] = useState(null)
    const [errorMsg, setErrorMsg] = useState("")

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
        }
        start();
        
    }, [])

    return(
    <>
    <div className={styles.container}>
        <h1 className={styles.viewnotetitle}>{note?.title}</h1>
        <p className={styles.viewnotetext}>{note?.text}</p>
        <p className={styles.viewnotedate}>Created: {note?.dateCreated}</p>
        <p className={styles.viewnotedate}>Edited: {note?.dateUpdated??"Never"}</p>
        <img className={styles.viewnoteimg} src={"https://localhost:7107/"+note?.image} alt="No image"/>
        <br/>
        <button className={styles.editnote} onClick={() => navigate("/createeditnote/" + id)}>Edit</button>
    </div>
    </>)

}

export default ViewNote