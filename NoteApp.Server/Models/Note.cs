using System.ComponentModel.DataAnnotations;

namespace NoteApp.Server.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public string Image { get; set; } = string.Empty;
        public virtual User Owner { get; set; }
        public virtual IList<NoteUser> OtherUsers { get; set; }
        public Note()
        {
            OtherUsers = new List<NoteUser>();
        }
    }
}
