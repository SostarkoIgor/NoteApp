using NoteApp.Server.Models;

namespace NoteApp.Server.Interfaces
{
    public interface INoteService
    {
        public Task<IEnumerable<Note>> GetUserNotesAsync(User? user);
        public Task<Note?> GetNoteByIdAsync(int? id);
        public Task<bool> GetIfNoteWithIDExistsAsync(int? id);
        public Task<Note> SaveNoteAsync(Note note);
        public Task<Note> UpdateNoteAsync(Note note);
    }
}
