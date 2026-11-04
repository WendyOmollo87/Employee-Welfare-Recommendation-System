using EmployeeWelfare.API.Data;
using EmployeeWelfare.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeWelfare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgramsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProgramsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/programs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WelfareProgram>>> GetPrograms()
    {
        return await _context.WelfarePrograms.ToListAsync();
    }

    // GET: api/programs/5
    [HttpGet("{id}")]
    public async Task<ActionResult<WelfareProgram>> GetProgram(int id)
    {
        var program = await _context.WelfarePrograms.FindAsync(id);
        if (program == null) return NotFound();
        return program;
    }

    // POST: api/programs
    [HttpPost]
    public async Task<ActionResult<WelfareProgram>> CreateProgram(WelfareProgram program)
    {
        _context.WelfarePrograms.Add(program);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProgram), new { id = program.Id }, program);
    }

    // PUT: api/programs/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProgram(int id, WelfareProgram program)
    {
        if (id != program.Id) return BadRequest();
        _context.Entry(program).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.WelfarePrograms.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/programs/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProgram(int id)
    {
        var program = await _context.WelfarePrograms.FindAsync(id);
        if (program == null) return NotFound();
        _context.WelfarePrograms.Remove(program);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // POST: api/programs/seed
    [HttpPost("seed")]
    public async Task<IActionResult> SeedPrograms()
    {
        if (await _context.WelfarePrograms.AnyAsync())
        {
            return BadRequest("Programs already exist. Seed skipped.");
        }
var programs = EmployeeWelfare.API.Data.SeedPrograms.GetPrograms();
        _context.WelfarePrograms.AddRange(programs);
        await _context.SaveChangesAsync();

        return Ok(new { inserted = programs.Count });
    }
}