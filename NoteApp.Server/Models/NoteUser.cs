namespace NoteApp.Server.Models
{
    public class NoteUser
    {
        public int NoteId { get; set; }
        public Note Note { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public bool CanEdit { get; set; } = false;
    }

}
