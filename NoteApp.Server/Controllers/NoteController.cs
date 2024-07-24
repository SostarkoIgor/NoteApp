using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoteApp.Server.Data;
using NoteApp.Server.Dtos;
using NoteApp.Server.Interfaces;
using NoteApp.Server.Models;
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


        public NoteController(AppDbContext appDbContext, IHttpContextAccessor contextAccessor, IUserService userService)
        {
            _appDbContext = appDbContext;
            _contextAccessor = contextAccessor;
            _userService = userService;
        }

        [HttpPost("/createoreditnote")]
        public async Task<IActionResult> CreateOrEditNote([FromBody] NoteDto noteDto)
        {
            var user = _contextAccessor.HttpContext?.User;
            if (user == null || !user.Identity.IsAuthenticated)
            {
                return BadRequest("User not authenticated.");
            }
            var user_ = await _userService.GetByMailAsync(user.FindFirstValue(ClaimTypes.Email));
            if (user_ == null)
            {
                return BadRequest("User not found.");
            }

            Note note = new()
            {
                Title = noteDto.Title ?? "",
                Text = noteDto.Text ?? "",
                Image = noteDto.Image ?? "",
                DateCreated = DateTime.Now,
                DateUpdated = null,
                Owner=user_
            };

            _appDbContext.Notes.Add(note);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof (CreateOrEditNote), noteDto);
        }
    }
}
