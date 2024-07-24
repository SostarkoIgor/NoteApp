using Microsoft.EntityFrameworkCore;
using NoteApp.Server.Data;
using NoteApp.Server.Interfaces;
using NoteApp.Server.Models;

namespace NoteApp.Server.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _appDbContext;

        public UserService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<User?> GetByMailAsync(string? mail)
        {
            if (mail == null) return null;
            return await _appDbContext.Users.FirstOrDefaultAsync(x => x.Email == mail);
        }
    }
}
