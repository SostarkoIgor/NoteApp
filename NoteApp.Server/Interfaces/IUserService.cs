using NoteApp.Server.Models;

namespace NoteApp.Server.Interfaces
{
    public interface IUserService
    {
        public Task<User?> GetByMailAsync(string? mail);
    }
}
