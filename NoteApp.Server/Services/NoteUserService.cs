using Microsoft.EntityFrameworkCore;
using NoteApp.Server.Data;
using NoteApp.Server.Interfaces;
using NoteApp.Server.Models;

namespace NoteApp.Server.Services
{
    public class NoteUserService : INoteUserService {
        private readonly AppDbContext _appDbContext;

        public NoteUserService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<bool> checkPermisionForEditAsync(int? noteid, User user)
        {
            if (noteid == null) return false;
            var con = await _appDbContext.NoteUsers.Include(n=>n.Note).Where(n => n.UserId == user.Id && n.Note.Id == noteid).FirstOrDefaultAsync();
            if (con==null) return false;
            return con.CanEdit;
        }

        public async Task<bool> checkPermisionForViewAsync(int? noteid, User user)
        {
            if (noteid == null) return false;
            var con=await _appDbContext.NoteUsers.Include(n => n.Note).Where(n => n.UserId == user.Id && n.Note.Id == noteid).FirstOrDefaultAsync();
            return con!=null;
        }
    }
}
