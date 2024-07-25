import { useState } from "react"
import ImageLoader from "../Components/ImageLoader.jsx"
import { useNavigate } from "react-router-dom"

function CreateEditNote(){

    const [imageBase64, setImageBase64] = useState(null)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")

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
        <>
        <form onSubmit={onSubmitForm}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <textarea placeholder="Write a note..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <ImageLoader updateFormImage={updateFormImage}/>
            <input type="submit" value="Submit"></input>
        </form>
        </>

    )
}

export default CreateEditNote