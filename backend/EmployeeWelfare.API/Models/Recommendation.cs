namespace EmployeeWelfare.API.Models;

public class Recommendation
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public int WelfareProgramId { get; set; }
    public WelfareProgram? WelfareProgram { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}