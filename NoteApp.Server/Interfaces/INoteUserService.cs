using NoteApp.Server.Models;

namespace NoteApp.Server.Interfaces
{
    public interface INoteUserService
    {
        public Task<bool> checkPermisionForViewAsync(int? noteid, User user);
        public Task<bool> checkPermisionForEditAsync(int? noteid, User user);
    }
}
