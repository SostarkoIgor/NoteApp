using Microsoft.AspNetCore.Identity;

namespace NoteApp.Server.Models
{
    public class User:IdentityUser
    {
        public virtual IList<NoteUser> OtherUserNotes { get; set; }
        public User()
        {
            OtherUserNotes = new List<NoteUser>();
        }
    }
}
