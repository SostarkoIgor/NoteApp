import styles from '../Styles/SmallNote.module.css';
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
    <div className={styles.smallnote}>
      <button className={styles.smallnotedelete} onClick={() => handleDelete()}>&#10006;</button>
      {image==="" ? <div className={styles.imagecontainer}><img className={styles.smallnoteimg} src="https://via.placeholder.com/150?text=No+Image" alt="No image"></img></div> : 
      <div className={styles.imagecontainer}><img className={styles.smallnoteimg} src={"https://localhost:7107/"+image} alt="No image"></img></div>}
      <div>
      <h3 className={styles.smallnotetitle}>{title}</h3>
      <p className={styles.smallnotedate}>Created: {formatDate(datecr)}</p>
      <p className={styles.smallnotedate}>Edited: {formatDate(dateedit)}</p>
      <button className={styles.smallnoteopen} onClick={() => navigate(`/viewnote/${index}`)}>Open</button>
      
      </div>
    </div>
  )
}

export default SmallNote;