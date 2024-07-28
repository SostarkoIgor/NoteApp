import { useState, useEffect } from "react"
import ImageLoader from "../Components/ImageLoader.jsx"
import { useNavigate, useParams } from "react-router-dom"
import '../Styles/CreateEditNote.css'

function CreateEditNote(){

    const [imageBase64, setImageBase64] = useState(null)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [formTitle, setFormTitle] = useState("Create Note")
    const {id}=useParams()

    useEffect(() => {
        async function start() {
            if (id) {
                try{
                let resp=await fetch("/api/Note/getnotebyid/"+id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                if (resp.status==200) {
                    let note=await resp.json()
                    setTitle(note.title)
                    setText(note.text)
                    setImageBase64(note.image)
                    setFormTitle("Edit Note")
                }
                }
                catch(e) {
                    console.log(e)
                }
            }
        }
        start()
    }, [])

    const navigator = useNavigate()

    const onSubmitForm = async (e) => {
        e.preventDefault()
        let id_=id? id:""
        await fetch("/api/Note/createoreditnote/"+id_, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                text: text,
                image: imageBase64
            })}).then(d => {
                if (d.status == 200) {
                    navigator("/")
                }else {
                    console.log("Error creating/updating note.")
                }
            }).catch(e => {
                console.log("Error creating/updating note.")
            })

        }
    const updateFormImage = (imageBase64) => {
        setImageBase64(imageBase64)
    }
    return (
        <div className="form-content-div">
        <h2>{formTitle}</h2>
        <div className="note-form">
        <form onSubmit={onSubmitForm}>
            <div className="form-wrapper-div">
                <div>
                    <label htmlFor="title">Title</label>
                </div>
                <div>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
            </div>

            <div className="form-wrapper-div">
            <label htmlFor="text">Text</label>

            <textarea className="note-text-input" placeholder="Write a note..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
            </div>

            <div className="form-wrapper-div">
            <div><label htmlFor="image">Image</label></div>
            <div><ImageLoader updateFormImage={updateFormImage} initialImg={imageBase64}/></div>
            </div>

            <input type="submit" value="Submit"></input>
        </form>
            </div>
        </div>
        

    )
}

export default CreateEditNote