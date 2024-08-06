import { useState, useEffect } from "react";
import ImageLoader from "../Components/ImageLoader.jsx";
import { useNavigate, useParams } from "react-router-dom";
import styles from '../Styles/CreateEditNote.module.css';
import styles_wn from '../Styles/ViewNote.module.css';
import Loader from "../Components/Loader.jsx";
function CreateEditNote() {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [formTitle, setFormTitle] = useState("Create Note");
    const { id } = useParams();
    const [userPermissions, setUserPermissions] = useState([]);
    const [user, setUser] = useState("");
    const [canEdit, setCanEdit] = useState(false);
    const [simage, setSimage] = useState(null);
    const [permited, setPermited] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function start() {
            if (id) {
                try {
                    let resp = await fetch(`/api/Note/getnoteuserpermissions/${id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (resp.status === 200) {
                        let permissions = await resp.json();
                        setUserPermissions(permissions);
                        try {
                            let resp = await fetch(`/api/Note/getnotebyid/${id}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            if (resp.status === 200) {
                                setLoading(false);
                                let note = await resp.json();
                                setTitle(note.title);
                                setText(note.text);
                                setImage(note.image);
                                setSimage(note.image);
                                setPermited(true);
                                setFormTitle("Edit Note");
                            }
                        } catch (e) {
                            console.log(e);
                            setLoading(false);
                        }
                    } else if (resp.status === 403) {
                        setPermited(false);
                        window.alert("You don't have permission to edit this note");
                        window.location.href = "/";
                        setLoading(false);
                    }
                } catch (e) {
                    console.log(e);
                    setLoading(false);
                    window.location.href = "/";
                }
            }
            else {
                setLoading(false)
                setPermited(true)
            }
        }
        start();
    }, [id]);

    const navigator = useNavigate();

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Add JSON data as a string
        formData.append("noteDto_", JSON.stringify({
            Title: title,
            Text: text,
            Permissions: userPermissions,
            Image: image==="noimg"?"noimg":""
        }));
        
        // Add existing image path if editing
        formData.append("odlimgpath", simage);

        // Add new image file if selected
        if (image) {
            formData.append("image", image);
        }
        
        let id_ = id ? id : "";
        try {
            const response = await fetch(`/api/Note/createoreditnote/${id_}`, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                navigator("/");
            } else {
                console.log("Error creating/updating note.", response.status);
            }
        } catch (e) {
            console.log("Error creating/updating note.", e);
        }
    };

    const updateFormImage = (image) => {
        setImage(image);
    };

    function addToPermissions() {
        if (user === "") {
            return;
        }
        if (userPermissions.some(permission => permission[0] === user)) {
            return;
        }
        setUserPermissions([...userPermissions, [user, canEdit ? "true" : "false"]]);
        setCanEdit(false);
        setUser("");
    }

    function changeCanEdit(value, index) {
        const updatedPermissions = userPermissions.map((e, i) => i === index ? [e[0], value ? "true" : "false"] : e);
        setUserPermissions(updatedPermissions);
    }

    function removeFromPermissions(index) {
        const updatedPermissions = userPermissions.filter((e, i) => i !== index);
        setUserPermissions(updatedPermissions);
    }

    if (loading) {
        return <div className={styles_wn.centeringcontainer}><Loader/></div>
    } else if (!permited) {
        return <div className={styles_wn.centeringcontainer}></div>
    } else {
        return (
            <div className={`${styles_wn.container} ${styles.container}`}>
                <div className={styles_wn.note}>
                <h2>{formTitle}</h2>
                    <form onSubmit={onSubmitForm}>
                        <div className={styles.formwrapperdiv}>
                            <div><label className={styles_wn.title} htmlFor="title">Title: </label></div>
                            <div>
                                <input
                                    className={`${styles_wn.viewnotetitle} ${styles.titleinput}`}
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div><label className={styles_wn.title} htmlFor="title">Title: </label></div>
                            <textarea
                                className={styles_wn.viewnotetext}
                                placeholder="Write a note..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                name="text"
                            ></textarea>
                        
                        <div className={styles.formwrapperdiv}>
                            <div><label className={styles_wn.title} htmlFor="image">Image: </label></div>
                            <div><ImageLoader updateFormImage={updateFormImage} initialImg={image} /></div>
                        </div>
                        <a className={styles_wn.title}>Users: </a>
                        <div className={styles.formwrapperdivadd}>
                            <input
                                className={styles.userperminput}
                                type="text"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                            <a>Can edit:</a>
                            <input
                                className={styles.userperminputchbox}
                                type="checkbox"
                                checked={canEdit}
                                onChange={(e) => setCanEdit(e.target.checked)}
                            />
                            <button className={styles_wn.editnote} type="button" onClick={addToPermissions}>Add</button>
                        </div>
                        <div className="form-wrapper-div">
                            {userPermissions.map((permission, index) => (
                                <div key={index} className={styles.userpermdiv}>
                                    <a style={{fontWeight: "bold"}}>{permission[0]}</a>
                                    <a>Can edit:</a>
                                    <input
                                        className={styles.userperminputchbox}
                                        type="checkbox"
                                        checked={permission[1] === "true"}
                                        onChange={(e) => changeCanEdit(e.target.checked, index)}
                                    />
                                    
                                    <button className={styles_wn.editnote} type="button" onClick={() => removeFromPermissions(index)}>Remove</button>
                                    
                                </div>
                            ))}
                        </div>
                        <input className={styles_wn.editnote} type="submit" value="Submit"></input>
                        <button className={styles_wn.editnote} type="button" onClick={() => navigator("/")}>Cancel</button>
                    </form>
                </div>
                </div>
        );
    }
}

export default CreateEditNote;
