namespace EmployeeWelfare.API.Models;

public class EmployeeWelfareInfo
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
   [System.Text.Json.Serialization.JsonIgnore]
public Employee? Employee { get; set; }
    public int CaregivingResponsibility { get; set; } = 0;
    public int ElderlyCareNeed { get; set; } = 0;
    public int EducationSupportNeed { get; set; } = 0;

    // Financial & wellbeing
    public int FinancialDifficulty { get; set; } = 0;
    public int MentalWellbeingConcern { get; set; } = 0;
    public int HealthConcern { get; set; } = 0;

    // Life events
    public int BereavementRecent { get; set; } = 0;
    public int DivorceRecent { get; set; } = 0;
    public int MarriageRecent { get; set; } = 0;
    public int BirthRecent { get; set; } = 0;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}