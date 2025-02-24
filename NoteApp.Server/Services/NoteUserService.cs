﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NoteApp.Server.Data;
using NoteApp.Server.Interfaces;
using NoteApp.Server.Models;

namespace NoteApp.Server.Services
{
    public class NoteUserService : INoteUserService {
        private readonly AppDbContext _appDbContext;
        private readonly UserManager<User> _userManager;
        private readonly INoteService _noteService;

        public NoteUserService(AppDbContext appDbContext, UserManager<User> userManager, INoteService noteService)
        {
            _appDbContext = appDbContext;
            _userManager = userManager;
            _noteService = noteService;
        }

        public async Task<bool> addOrUpdateUserNotePermissionAsync(int? noteid, string usermail, bool canEdit = false)
        {
            if (noteid == null) return false;
            NoteUser? noteUser=await _appDbContext.NoteUsers.Where(n=>n.NoteId == noteid && n.User.Email==usermail).FirstOrDefaultAsync();
            if (noteUser == null){
                var note = await _appDbContext.Notes.Where(n => n.Id == noteid).FirstOrDefaultAsync();
                if (note == null) return false;
                var user = await _userManager.FindByEmailAsync(usermail);
                if (user==null) return false;
                noteUser =new NoteUser() { CanEdit = canEdit, Note=note, User= user};
                _appDbContext.NoteUsers.Add(noteUser);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                noteUser.CanEdit = canEdit;
                _appDbContext.NoteUsers.Update(noteUser);
                await _appDbContext.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> checkPermissionForEditAsync(int? noteid, User user)
        {
            if (noteid == null) return false;
            var user_ = await _appDbContext.Notes.Include(n => n.Owner).Where(n => n.Id == noteid).FirstOrDefaultAsync();
            if (user_?.Owner.Id==user.Id) return true;
            var con = await _appDbContext.NoteUsers.Include(n=>n.Note).Where(n => n.UserId == user.Id && n.Note.Id == noteid).FirstOrDefaultAsync();
            if (con==null) return false;
            return con.CanEdit;
        }

        public async Task<bool> checkPermissionForViewAsync(int? noteid, User user)
        {
            if (noteid == null) return false;
            var user_ = await _appDbContext.Notes.Include(n => n.Owner).Where(n => n.Id == noteid).FirstOrDefaultAsync();
            if (user_?.Owner.Id == user.Id) return true;
            var con=await _appDbContext.NoteUsers.Include(n => n.Note).Where(n => n.UserId == user.Id && n.Note.Id == noteid).FirstOrDefaultAsync();
            return con!=null;
        }

        public async Task<IEnumerable<Note>> getNotesSharedWithUserAsync(User user)
        {
            return await _appDbContext.NoteUsers.Where(n => n.UserId == user.Id).Include(n => n.Note).Select(n => n.Note).ToListAsync();
        }

        public async Task<IEnumerable<Note>> getNotesSharedWithUserFromUserAsync(User user, string usermail)
        {
            return (await getNotesSharedWithUserAsync(user)).Where(n=>n.Owner.Email == usermail).ToList();
        }

        public async Task<IEnumerable<IEnumerable<string>>> getUserPermissionsForNoteAsync(int noteid)
        {
            var noteUsers=await _appDbContext.NoteUsers.Where(n=>n.NoteId==noteid).Select(n=>new List<string>() { n.User.Email, n.CanEdit?"true":"false"}).ToListAsync();
            return noteUsers;
        }

        public async Task removeAllNotePermisionsAsync(int id)
        {
            _appDbContext.RemoveRange(await _appDbContext.NoteUsers.Where(n=>n.NoteId==id).ToListAsync());
            await _appDbContext.SaveChangesAsync();
        }

        public async Task<bool> removeUserNotePermissionAsync(int noteid, string usermail)
        {
            var pr = await _appDbContext.NoteUsers.Where(n => n.NoteId == noteid && n.User.Email == usermail).FirstOrDefaultAsync();
            if (pr==null) return false;
            _appDbContext.NoteUsers.Remove(pr);
            await _appDbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> setPermissionsAsync(int id, List<List<string>>? permissions, User user)
        {
            if (permissions == null) return false;
            if (!await checkPermissionForEditAsync(id, user))
            {
                return false;
            }
            await removeAllNotePermisionsAsync(id);
            var usermail=(await _noteService.GetNoteByIdAsync(id)).Owner.Email;
            foreach (var permission in permissions)
            {
                if (permission[0]==usermail) { continue; }
                await addOrUpdateUserNotePermissionAsync(id, permission[0], permission[1] == "true");
            }
            return true;
        }
    }
}
