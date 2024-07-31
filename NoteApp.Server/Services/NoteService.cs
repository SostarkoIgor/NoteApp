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

        public async Task<bool> DeleteNoteAsync(int id)
        {
            var rez=await _appDbContext.Notes.Where(n => n.Id == id).FirstOrDefaultAsync();
            if (rez == null)
            {
                return false;
            }
            _appDbContext.Notes.Remove(rez);
            _appDbContext.SaveChanges();
            return true;
        }

        public async Task<bool> GetIfNoteWithIDExistsAsync(int? id)
        {
            if (id == null) return false;
            var n=await _appDbContext.Notes.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (n == null) return false;
            return true;
        }

        public async Task<Note?> GetNoteByIdAsync(int? id)
        {
            if (id == null) return null;
            var note= await _appDbContext.Notes.Where(x => x.Id == id).Include(s=>s.Owner).FirstOrDefaultAsync();
            return note;
        }

        public async Task<IEnumerable<Note>> GetUserNotesAsync(User? user)
        {
            if (user == null) return new List<Note>();
            return await _appDbContext.Notes.Where(n => n.Owner.Id == user.Id).Select(n => new Note
            { Id = n.Id, Title = n.Title, DateCreated = n.DateCreated, DateUpdated = n.DateUpdated, Image=n.Image }).ToListAsync();
        }

        public async Task<Note> SaveNoteAsync(Note note)
        {
            _appDbContext.Notes.Add(note);
            await _appDbContext.SaveChangesAsync();
            return note;
        }

        public async Task<Note> UpdateNoteAsync(Note note)
        {
            _appDbContext.Notes.Update(note);
            await _appDbContext.SaveChangesAsync();
            return note;
        }


    }
}
