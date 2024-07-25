using NoteApp.Server.Models;

namespace NoteApp.Server.Interfaces
{
    public interface INoteService
    {
        public Task<IEnumerable<Note>> GetUserNotesAsync(User? user);
    }
}
