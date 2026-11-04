namespace EmployeeWelfare.API.Models;

public class Alert
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Severity { get; set; } = "medium"; // high, medium
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
}