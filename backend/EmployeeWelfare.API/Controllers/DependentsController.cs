using EmployeeWelfare.API.Data;
using EmployeeWelfare.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeWelfare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DependentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DependentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/dependents/employee/5
    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<Dependent>>> GetByEmployee(int employeeId)
    {
        return await _context.Dependents
            .Where(d => d.EmployeeId == employeeId)
            .OrderBy(d => d.Id)
            .ToListAsync();
    }

    // POST: api/dependents
    [HttpPost]
    public async Task<ActionResult<Dependent>> CreateDependent(Dependent dependent)
    {
        // PostgreSQL requires UTC. Ensure the date arrives as UTC.
        dependent.DateOfBirth = DateTime.SpecifyKind(dependent.DateOfBirth, DateTimeKind.Utc);

        _context.Dependents.Add(dependent);
        await _context.SaveChangesAsync();
        return Ok(dependent);
    }

    // PUT: api/dependents/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDependent(int id, Dependent dependent)
    {
        if (id != dependent.Id) return BadRequest();

        // Same fix on update.
        dependent.DateOfBirth = DateTime.SpecifyKind(dependent.DateOfBirth, DateTimeKind.Utc);

        _context.Entry(dependent).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Dependents.Any(d => d.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/dependents/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDependent(int id)
    {
        var dependent = await _context.Dependents.FindAsync(id);
        if (dependent == null) return NotFound();

        _context.Dependents.Remove(dependent);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}