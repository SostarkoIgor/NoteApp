import '../Styles/SmallNote.css';

function SmallNote({image, title, datecr, dateedit}) {

  const formatDate = (date_) => {
    if (date_ === null) return "Never";
    if (date_ === undefined) return "Never";
    if (date_ === "") return "Never";
    let date = new Date(date_);
    return String(date.getFullYear()) + " " + String(date.getMonth() + 1).padStart(2, '0') + " " + String(date.getDate()).padStart(2, '0')
  }
  return (
    <div className="small-note">
      <div><img className="small-note-img" src={image} alt="No image"></img></div>
      <div>
      <h3 className="small-note-title">{title}</h3>
      <p className="small-note-date">Created: {formatDate(datecr)}</p>
      <p className="small-note-date">Edited: {formatDate(dateedit)}</p>
      <button className="small-note-open">Open</button>
      </div>
    </div>
  )
}

export default SmallNote;