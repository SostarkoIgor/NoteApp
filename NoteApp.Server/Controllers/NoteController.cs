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

namespace NoteApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUserService _userService;
        private readonly UserManager<User> _userManager;
        private readonly INoteService _noteService;


        public NoteController(AppDbContext appDbContext, IHttpContextAccessor contextAccessor, IUserService userService, UserManager<User> userManager, INoteService noteService)
        {
            _appDbContext = appDbContext;
            _contextAccessor = contextAccessor;
            _userService = userService;
            _userManager = userManager;
            _noteService = noteService;
        }
        [HttpPost("createoreditnote")]
        public async Task<IActionResult> CreateOrEditNote([FromBody] NoteDto noteDto)
        {
            var user = await _userService.GetUserAsync();
            if (user == null)
            {
                return NotFound("User not found.");
            }
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



            _appDbContext.Notes.Add(note);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateOrEditNote), noteDto);
        }
        [HttpGet("getusernotes")]
        [HttpGet("getusernotes/{mail}")]
        public async Task<ActionResult<IEnumerable<Note>>> GetUserNotes(string? mail)
        {
            User? user;
            if (mail == null)
            {
                user=await _userService.GetUserAsync();
                if (user == null)
                {
                    return NotFound("User not found.");
                }
                var notes= await _noteService.GetUserNotesAsync(user);
                return Ok(notes);
            }
            else if (mail == await _userManager.GetEmailAsync(await _userManager.GetUserAsync(_contextAccessor.HttpContext?.User)))
            {
                user=await _userService.GetUserAsync();
                var notes = await _noteService.GetUserNotesAsync(user);
                return Ok(notes);
            }
            else return BadRequest("Implement later");
        }
    }
}
