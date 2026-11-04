namespace EmployeeWelfare.API.Models;

public class LifeEvent
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public string EventType { get; set; } = string.Empty; // Bereavement, Birth of child, etc.
    public DateTime ReportedDate { get; set; } = DateTime.UtcNow;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Submitted"; // Submitted, Under review, Reviewed
}