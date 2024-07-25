using Microsoft.EntityFrameworkCore;
using NoteApp.Server.Data;
using NoteApp.Server.Interfaces;
using NoteApp.Server.Models;

namespace NoteApp.Server.Services
{
    public class NoteService : INoteService
    {
        private readonly AppDbContext _appDbContext;

        public NoteService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<IEnumerable<Note>> GetUserNotesAsync(User? user)
        {
            if (user == null) return new List<Note>();
            return await _appDbContext.Notes.Where(n => n.Owner.Id == user.Id).ToListAsync();
        }
    }
}
