import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

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
    <div className="view-note">
        <h1 className="view-note-title">{note?.title}</h1>
        <p className="view-note-text">{note?.text}</p>
        <p className="view-note-date">Created: {note?.dateCreated}</p>
        <p className="view-note-date">Edited: {note?.dateUpdated??"Never"}</p>
        <img className="view-note-img" src={"https://localhost:7107/"+note?.image} alt="No image"/>
        <br/>
        <button className="edit-note" onClick={() => navigate("/createeditnote/" + id)}>Edit</button>
    </div>
    </>)

}

export default ViewNote