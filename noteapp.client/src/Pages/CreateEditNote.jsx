import { useState } from "react"
import ImageLoader from "../Components/ImageLoader.jsx"
import { useNavigate } from "react-router-dom"
import '../Styles/CreateEditNote.css'

function CreateEditNote(){

    const [imageBase64, setImageBase64] = useState(null)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [formTitle, setFormTitle] = useState("Create Note")

    const navigator = useNavigate()

    const onSubmitForm = (e) => {
        e.preventDefault()
        fetch("api/note/createoreditnote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                text: text,
                image: imageBase64
            })}).then(d => {
                if (d.ok) {
                    navigator("/")
                }else {
                    console.log("Error creating note."+e)
                }
            }).catch(e => {
                console.log("Error creating note."+e)
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
                    <label for="title">Title</label>
                </div>
                <div>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
            </div>

            <div className="form-wrapper-div">
            <label for="text">Text</label>

            <textarea className="note-text-input" placeholder="Write a note..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
            </div>

            <div className="form-wrapper-div">
            <div><label for="image">Image</label></div>
            <div><ImageLoader updateFormImage={updateFormImage}/></div>
            </div>

            <input type="submit" value="Submit"></input>
        </form>
            </div>
        </div>
        

    )
}

export default CreateEditNote