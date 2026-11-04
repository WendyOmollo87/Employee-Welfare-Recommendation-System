namespace EmployeeWelfare.API.Models;

public class Employee
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = "Full-time";
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Probation";
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string MaritalStatus { get; set; } = "Single";
    public int ClusterId { get; set; } = -1;
    public string ClusterLabel { get; set; } = "Unassigned";
    public bool MustChangePassword { get; set; } = true;
public bool OnboardingComplete { get; set; } = false;
public string? TempPassword { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  
    public EmployeeWelfareInfo? WelfareInfo { get; set; }
    public List<Dependent> Dependents { get; set; } = new();
    public List<LifeEvent> LifeEvents { get; set; } = new();
    public List<Recommendation> Recommendations { get; set; } = new();
    public List<Notification> Notifications { get; set; } = new();
    public List<Alert> Alerts { get; set; } = new();
}