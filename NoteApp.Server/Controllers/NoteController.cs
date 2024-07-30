using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoteApp.Server.Data;
using NoteApp.Server.Dtos;
using NoteApp.Server.Interfaces;
using NoteApp.Server.Models;
using NoteApp.Server.Services;
using System.Security.Claims;
using static Azure.Core.HttpHeader;

namespace NoteApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NoteController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUserService _userService;
        private readonly UserManager<User> _userManager;
        private readonly INoteService _noteService;
        private readonly INoteUserService _noteUserService;


        public NoteController(AppDbContext appDbContext, IHttpContextAccessor contextAccessor, IUserService userService, UserManager<User> userManager, INoteService noteService, INoteUserService noteUserService)
        {
            _appDbContext = appDbContext;
            _contextAccessor = contextAccessor;
            _userService = userService;
            _userManager = userManager;
            _noteService = noteService;
            _noteUserService = noteUserService;
        }
        [HttpPost("createoreditnote")]
        [HttpPost("createoreditnote/{id}")]
        public async Task<IActionResult> CreateOrEditNote([FromBody] NoteDto noteDto, [FromRoute] int? id)
        {
            bool noteExists = await _noteService.GetIfNoteWithIDExistsAsync(id);
            var user = await _userService.GetUserAsync();
            if (user == null)
            {
                return NotFound();
            }
            if (id == null || !noteExists)
            {
                Note note;
                note = new()
                {
                    Title = noteDto.Title ?? "",
                    Text = noteDto.Text ?? "",
                    Image = noteDto.Image ?? "",
                    DateCreated = DateTime.Now,
                    DateUpdated = null,
                    Owner = user
                };

                await _noteService.SaveNoteAsync(note);

                await _noteUserService.setPermissionsAsync(note.Id, noteDto.Permissions, user);

                return CreatedAtAction(nameof(CreateOrEditNote), noteDto);
            }
            else
            {
                bool canEdit = await _noteUserService.checkPermissionForEditAsync(id, user);
                if (canEdit)
                {
                    Note? note= await _noteService.GetNoteByIdAsync(id);
                    note.Title=noteDto.Title ?? note.Title;
                    note.Text=noteDto.Text ?? note.Text;
                    note.Image=noteDto.Image ?? note.Image;
                    note.DateUpdated = DateTime.Now;
                    await _noteService.UpdateNoteAsync(note);
                    await _noteUserService.setPermissionsAsync(note.Id, noteDto.Permissions, user);
                    return Ok(noteDto);
                }
                else return Forbid();
            }
        }
        [HttpGet("getusernotes")]
        [HttpGet("getusernotes/{mail}")]
        public async Task<ActionResult<IEnumerable<Note>>> GetUserNotes([FromRoute] string? mail)
        {
            User? user= await _userService.GetUserAsync();
            if (mail == null)
            {
                if (user == null)
                {
                    return NotFound();
                }
                var notes= await _noteService.GetUserNotesAsync(user);
                return Ok(notes);
            }
            else if (mail == user.Email)
            {
                var notes = await _noteService.GetUserNotesAsync(user);
                return Ok(notes);
            }
            else
            {
                return Ok(await _noteUserService.getNotesSharedWithUserFromUserAsync(user, mail));
            }
        }
        [HttpGet("getnotebyid/{id}")]
        public async Task<ActionResult<Note>> GetNoteById([FromRoute] int? id)
        {
            if (id == null)
            {
                return BadRequest();
            }
            Note? note = await _noteService.GetNoteByIdAsync(id);
            if (note == null)
            {
                return NotFound();
            }
            if (note.Owner.Id== (await _userService.GetUserAsync())?.Id)
            {
                return Ok(note);
            }
            else
            {
                if (await _noteUserService.checkPermissionForViewAsync(id, await _userService.GetUserAsync()))
                {
                    return Ok(new Note { DateCreated=note.DateCreated, DateUpdated=note.DateUpdated, Id=note.Id, Image=note.Image, Text=note.Text, Title=note.Title });
                }
                else return Forbid();
            }
        }
        [HttpGet("getnoteuserpermissions/{id}")]
        public async Task<ActionResult<IEnumerable<IEnumerable<string>>>> getNoteUsersWithPermissions(int id)
        {
            if (!await _noteUserService.checkPermissionForEditAsync(id, await _userService.GetUserAsync()))
            {
                return Forbid();
            }
            var perms=await _noteUserService.getUserPermissionsForNoteAsync(id);
            return Ok(perms);

        }
        [HttpGet("getnotessharedwithuser")]
        public async Task<ActionResult<IEnumerable<Note>>> getNotesSharedWithUser()
        {
            return Ok(await _noteUserService.getNotesSharedWithUserAsync(await _userService.GetUserAsync()));
        }

        

    }
    
}
