import '../Styles/SmallNote.css';
import { useNavigate } from 'react-router-dom';

function SmallNote({index, image, title, datecr, dateedit}) {

  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this note?");
    if (!confirmation) return;
    await fetch("/api/Note/deletenote/" + index, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((d) => {
      if (d.status == 200) {
        window.location.reload();
      }else if (d.status == 404) {
        window.alert("Note not found.");
      }else if (d.status == 403) {
        window.alert("You don't have permission to delete this note.");
      }
      else {
        console.log("Error deleting note.");
      }
    }).catch((e) => {
      console.log("Error deleting note.");
    });
  }

  const formatDate = (date_) => {
    if (date_ === null) return "Never";
    if (date_ === undefined) return "Never";
    if (date_ === "") return "Never";
    let date = new Date(date_);
    return String(date.getFullYear()) + " " + String(date.getMonth() + 1).padStart(2, '0') + " " + String(date.getDate()).padStart(2, '0')
  }
  return (
    <div className="small-note">
      <div><img className="small-note-img" src={"https://localhost:7107/"+image} alt="No image"></img></div>
      <div>
      <h3 className="small-note-title">{title}</h3>
      <p className="small-note-date">Created: {formatDate(datecr)}</p>
      <p className="small-note-date">Edited: {formatDate(dateedit)}</p>
      <button className="small-note-open" onClick={() => navigate(`/viewnote/${index}`)}>Open</button>
      <button className="small-note-delete" onClick={() => handleDelete()}>Delete</button>
      </div>
    </div>
  )
}

export default SmallNote;