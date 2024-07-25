using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NoteApp.Server.Data;
using NoteApp.Server.Interfaces;
using NoteApp.Server.Models;

namespace NoteApp.Server.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<User> _userManager;

        public UserService(AppDbContext appDbContext, IHttpContextAccessor contextAccessor, UserManager<User> userManager)
        {
            _appDbContext = appDbContext;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }

        public async Task<User?> GetByMailAsync(string? mail)
        {
            if (mail == null) return null;
            return await _appDbContext.Users.FirstOrDefaultAsync(x => x.Email == mail);
        }
        public async Task<User?> GetUserAsync()
        {
            var user = _contextAccessor.HttpContext?.User;
            if (user == null || !user.Identity.IsAuthenticated)
            {
                return null;
            }
            var user_ = await _userManager.GetUserAsync(user);
            return user_;
        }
    }
}
