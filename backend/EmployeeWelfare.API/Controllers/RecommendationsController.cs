using EmployeeWelfare.API.Data;
using EmployeeWelfare.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeWelfare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RecommendationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetRecommendations(int employeeId)
    {
        var employee = await _context.Employees
            .Include(e => e.WelfareInfo)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null) return NotFound();

        var allPrograms = await _context.WelfarePrograms
            .Where(p => p.Enabled)
            .ToListAsync();

        var cluster = employee.ClusterLabel;
        var info = employee.WelfareInfo;
        
        // List to hold the scored programs
        var scoredPrograms = new List<(WelfareProgram Program, int Score, string Reason)>();

        foreach (var program in allPrograms)
        {
            var match = GetMatchReason(program.Name, cluster, info);
            if (match != null)
            {
                scoredPrograms.Add((program, match.Value.Score, match.Value.Reason));
            }
        }

        // Sort: Score 3 (Personal) first, then 2 (Cluster), then 1 (Universal)
        var sortedPrograms = scoredPrograms
            .OrderByDescending(x => x.Score)
            .ThenBy(x => x.Program.Name)
            .Select(x => new
            {
                x.Program.Id,
                x.Program.Name,
                x.Program.Category,
                x.Program.ShortDescription,
                x.Program.FullDescription,
                x.Program.Eligibility,
                x.Program.Coverage,
                x.Program.HowToApply,
                x.Program.Documents,
                x.Program.Contact,
                x.Program.ProcessingTime,
                Reason = x.Reason
            });

        return Ok(new
        {
            cluster = string.IsNullOrWhiteSpace(cluster) ? "Unassigned" : cluster,
            clusterId = employee.ClusterId,
            programs = sortedPrograms
        });
    }

    private (int Score, string Reason)? GetMatchReason(string programName, string cluster, EmployeeWelfareInfo? info)
    {
        if (info == null) return null;

        // ==========================================
        // SCORE 3: SPECIFIC INDIVIDUAL NEEDS (Top Priority)
        // ==========================================
        
        // Recent Birth / Adoption
        if (info.BirthRecent == 1 && 
            (programName.Contains("Childcare") || programName.Contains("Parental") || programName.Contains("Family")))
            return (3, "Matched because a new child recently joined your household.");

        // Recent Marriage
        if (info.MarriageRecent == 1 && 
            (programName.Contains("Family") || programName.Contains("Health Insurance")))
            return (3, "Matched because you recently got married.");

        // Recent Bereavement
        if (info.BereavementRecent == 1 && 
            (programName.Contains("Bereavement") || programName.Contains("Compassionate")))
            return (3, "Matched because you reported a recent bereavement.");

        // Financial Difficulty
        if (info.FinancialDifficulty == 1 && 
            (programName.Contains("Financial") || programName.Contains("Emergency")))
            return (3, "Matched due to your financial difficulty.");

        // Mental Wellbeing
        if (info.MentalWellbeingConcern == 1 && 
            (programName.Contains("Mental") || programName.Contains("Stress") || programName.Contains("Counselling")))
            return (3, "Matched because you reported a mental wellbeing concern.");

        // Education Support
        if (info.EducationSupportNeed == 1 && 
            (programName.Contains("Education") || programName.Contains("School Fee")))
            return (3, "Matched because you have education-related expenses.");

        // Elderly Care
        if (info.ElderlyCareNeed == 1 && 
            (programName.Contains("Eldercare") || programName.Contains("Caregiver")))
            return (3, "Matched because you support elderly dependents.");

        // Health Concern
        if (info.HealthConcern == 1 && 
            (programName.Contains("Health") || programName.Contains("Screening")))
            return (3, "Matched due to your health concern.");

        // Divorce
        if (info.DivorceRecent == 1 && 
            (programName.Contains("Single-Parent") || programName.Contains("Mental")))
            return (3, "Matched because your marital situation changed recently.");

        // ==========================================
        // SCORE 2: CLUSTER BASELINES (Medium Priority)
        // ==========================================
        switch (cluster)
        {
            case "Early Career":
                if (programName.Contains("Career") || programName.Contains("Retirement"))
                    return (2, "Recommended for the Early Career cluster.");
                break;

            case "Working Parent":
                if (programName.Contains("Childcare") || programName.Contains("Parental") || programName.Contains("Education"))
                    return (2, "Recommended for the Working Parent cluster.");
                break;

            case "Sandwich Caregiver":
                if (programName.Contains("Flexible") || programName.Contains("Respite") || programName.Contains("Eldercare"))
                    return (2, "Recommended for the Sandwich Caregiver cluster.");
                break;

            case "Recent Bereavement":
                if (programName.Contains("Priority HR") || programName.Contains("Legal"))
                    return (2, "Recommended for the Recent Bereavement cluster.");
                break;
        }

        // ==========================================
        // SCORE 1: UNIVERSAL PROGRAMS (Low Priority)
        // ==========================================
        if (programName.Contains("Preventive Health") || programName.Contains("Mental Wellbeing"))
            return (1, "Available to all employees.");

        return null;
    }
}