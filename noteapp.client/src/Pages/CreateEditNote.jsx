import { useState, useEffect } from "react"
import ImageLoader from "../Components/ImageLoader.jsx"
import { useNavigate, useParams } from "react-router-dom"
import '../Styles/CreateEditNote.css'

function CreateEditNote() {

    const [imageBase64, setImageBase64] = useState(null)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [formTitle, setFormTitle] = useState("Create Note")
    const { id } = useParams()
    const [userPermissions, setUserPermissions] = useState([])
    const [user, setUser] = useState("")
    const [canEdit, setCanEdit] = useState(false)

    useEffect(() => {
        async function start() {
            if (id) {
                try {
                    let resp = await fetch("/api/Note/getnotebyid/" + id, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                    if (resp.status == 200) {
                        let note = await resp.json()
                        setTitle(note.title)
                        setText(note.text)
                        setImageBase64(note.image)
                        setFormTitle("Edit Note")
                        try {
                            let resp = await fetch("/api/Note/getnoteuserpermissions/" + id, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            })
                            if (resp.status == 200) {
                                let permissions = await resp.json()
                                setUserPermissions(permissions)
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        start()
    }, [id])

    const navigator = useNavigate()

    const onSubmitForm = async (e) => {
        e.preventDefault()
        let id_ = id ? id : ""
        console.log(JSON.stringify({
            title: title,
            text: text,
            image: imageBase64,
            permissions: userPermissions
        }))
        await fetch("/api/Note/createoreditnote/" + id_, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                text: text,
                image: imageBase64,
                permissions: userPermissions
            })
        }).then(d => {
            if (d.status == 201 || d.status == 200) {
                navigator("/")
            } else {
                console.log("Error creating/updating note." + d.status)
            }
        }).catch(e => {
            console.log("Error creating/updating note.")
        })
    }

    const updateFormImage = (imageBase64) => {
        setImageBase64(imageBase64)
    }

    function addToPermissions() {
        if (user === "") {
            return
        }
        if (userPermissions.some(permission => permission[0] === user)) {
            return
        }
        setUserPermissions([...userPermissions, [user, canEdit?"true":"false"]])
        setCanEdit(false)
        setUser("")
    }

    function changeCanEdit(value, index) {
        const updatedPermissions = userPermissions.map((e, i) => i === index ? [e[0], value] : e)
        setUserPermissions(updatedPermissions)
    }

    function removeFromPermissions(index) {
        const updatedPermissions = userPermissions.filter((e, i) => i !== index)
        setUserPermissions(updatedPermissions)
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
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-wrapper-div">
                        <label htmlFor="text">Text</label>
                        <textarea
                            className="note-text-input"
                            placeholder="Write a note..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-wrapper-div">
                        <div><label htmlFor="image">Image</label></div>
                        <div><ImageLoader updateFormImage={updateFormImage} initialImg={imageBase64} /></div>
                    </div>

                    <div className="form-wrapper-div">
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <input
                            type="checkbox"
                            checked={canEdit}
                            onChange={(e) => setCanEdit(e.target.checked)}
                        />
                        <button type="button" onClick={addToPermissions}>Add</button>
                    </div>
                    <div className="form-wrapper-div">
                        {userPermissions.map((permission, index) => (
                            <div key={index}>
                                <p>{permission[0]}</p>
                                Can edit:
                                <input
                                    type="checkbox"
                                    checked={permission[1]==="true"}
                                    onChange={(e) => changeCanEdit(e.target.checked, index)}
                                />
                                <button type="button" onClick={() => removeFromPermissions(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        </div>
    )
}

export default CreateEditNote
