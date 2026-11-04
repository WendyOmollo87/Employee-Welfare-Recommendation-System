using EmployeeWelfare.API.Data;
using EmployeeWelfare.API.Models;
using EmployeeWelfare.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeWelfare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WelfareInfoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ClusterService _clusterService;
    private readonly ILogger<WelfareInfoController> _logger;

    public WelfareInfoController(ApplicationDbContext context, ClusterService clusterService, ILogger<WelfareInfoController> logger)
    {
        _context = context;
        _clusterService = clusterService;
        _logger = logger;
    }

    [HttpGet("{employeeId}")]
    public async Task<ActionResult<EmployeeWelfareInfo>> GetWelfareInfo(int employeeId)
    {
        var info = await _context.EmployeeWelfareInfos
            .FirstOrDefaultAsync(w => w.EmployeeId == employeeId);

        if (info == null) return NotFound();
        return info;
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeWelfareInfo>> CreateWelfareInfo(EmployeeWelfareInfo info)
    {
        _context.EmployeeWelfareInfos.Add(info);
        await _context.SaveChangesAsync();
        await RefreshClusterAsync(info.EmployeeId);
        return CreatedAtAction(nameof(GetWelfareInfo), new { employeeId = info.EmployeeId }, info);
    }

    [HttpPut("{employeeId}")]
    public async Task<IActionResult> UpdateWelfareInfo(int employeeId, EmployeeWelfareInfo info)
    {
        if (employeeId != info.EmployeeId) return BadRequest();

        var existing = await _context.EmployeeWelfareInfos
            .FirstOrDefaultAsync(w => w.EmployeeId == employeeId);

        if (existing == null) return NotFound();

        existing.CaregivingResponsibility = info.CaregivingResponsibility;
        existing.ElderlyCareNeed = info.ElderlyCareNeed;
        existing.EducationSupportNeed = info.EducationSupportNeed;
        existing.FinancialDifficulty = info.FinancialDifficulty;
        existing.MentalWellbeingConcern = info.MentalWellbeingConcern;
        existing.HealthConcern = info.HealthConcern;
        existing.BereavementRecent = info.BereavementRecent;
        existing.DivorceRecent = info.DivorceRecent;
        existing.MarriageRecent = info.MarriageRecent;
        existing.BirthRecent = info.BirthRecent;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        
        // TRIGGER THE AI HERE
        await RefreshClusterAsync(employeeId);

        return NoContent();
    }

    private async Task RefreshClusterAsync(int employeeId)
    {
        try 
        {
            _logger.LogInformation("Starting K-Means clustering for Employee {Id}", employeeId);
            
            var employee = await _context.Employees
                .Include(e => e.Dependents)
                .FirstOrDefaultAsync(e => e.Id == employeeId);

            var info = await _context.EmployeeWelfareInfos
                .FirstOrDefaultAsync(w => w.EmployeeId == employeeId);

            if (employee == null || info == null) return;

            var childrenCount = employee.Dependents.Count(d => d.Relationship == "Child");
            var elderlyDependents = employee.Dependents.Count(d => 
                d.Relationship == "Parent" || d.Relationship == "In-law");
            var totalDependents = employee.Dependents.Count;

            var (clusterId, clusterLabel) = await _clusterService.PredictAsync(
                totalDependents,
                childrenCount,
                elderlyDependents,
                info.CaregivingResponsibility,
                info.FinancialDifficulty,
                info.ElderlyCareNeed,
                info.EducationSupportNeed,
                info.BereavementRecent
            );

            _logger.LogInformation("K-Means returned: Cluster {ClusterId} - {Label}", clusterId, clusterLabel);

            employee.ClusterId = clusterId;
            employee.ClusterLabel = clusterLabel;
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to run K-Means clustering");
        }
    }
}