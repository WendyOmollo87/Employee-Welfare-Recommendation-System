using EmployeeWelfare.API.Data;
using EmployeeWelfare.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeWelfare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LifeEventsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LifeEventsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/lifeevents/employee/5
    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<LifeEvent>>> GetByEmployee(int employeeId)
    {
        return await _context.LifeEvents
            .Where(e => e.EmployeeId == employeeId)
            .OrderByDescending(e => e.ReportedDate)
            .ToListAsync();
    }

    // POST: api/lifeevents
    [HttpPost]
    public async Task<ActionResult<LifeEvent>> CreateLifeEvent(LifeEvent lifeEvent)
    {
        lifeEvent.ReportedDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);
        lifeEvent.Status = "Submitted";

        _context.LifeEvents.Add(lifeEvent);
        await _context.SaveChangesAsync();

        // Also create an HR alert
        var alert = new Alert
        {
            EmployeeId = lifeEvent.EmployeeId,
            Reason = $"{lifeEvent.EventType} reported",
            Severity = "medium",
            CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc)
        };
        _context.Alerts.Add(alert);
        await _context.SaveChangesAsync();

        return Ok(lifeEvent);
    }
}