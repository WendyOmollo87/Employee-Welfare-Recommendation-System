using EmployeeWelfare.API.Data;
using EmployeeWelfare.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeWelfare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AlertsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Alert>>> GetAlerts()
    {
        return await _context.Alerts
            .Include(a => a.Employee)
            .Where(a => a.ResolvedAt == null)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Alert>> CreateAlert(Alert alert)
    {
        _context.Alerts.Add(alert);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAlerts), new { id = alert.Id }, alert);
    }

    [HttpPut("{id}/resolve")]
    public async Task<IActionResult> ResolveAlert(int id)
    {
        var alert = await _context.Alerts.FindAsync(id);
        if (alert == null) return NotFound();

        alert.ResolvedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}