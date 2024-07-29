using NoteApp.Server.Models;

namespace NoteApp.Server.Interfaces
{
    public interface INoteUserService
    {
        public Task<bool> checkPermissionForViewAsync(int? noteid, User user);
        public Task<bool> checkPermissionForEditAsync(int? noteid, User user);
        public Task<IEnumerable<Note>> getNotesSharedWithUserAsync(User user);
        public Task<IEnumerable<Note>> getNotesSharedWithUserFromUserAsync(User user, string usermail);
        public Task<bool> addOrUpdateUserNotePermissionAsync(int? noteid, string usermail, bool canEdit=false);
        public Task<bool> removeUserNotePermissionAsync(int noteid, string usermail);
        public Task<IEnumerable<IEnumerable<string>>> getUserPermissionsForNoteAsync(int noteid);
        public Task removeAllNotePermisionsAsync(int id);
        public Task<bool> setPermissionsAsync(int id, List<List<string>>? permissions, User user);
    }
}
