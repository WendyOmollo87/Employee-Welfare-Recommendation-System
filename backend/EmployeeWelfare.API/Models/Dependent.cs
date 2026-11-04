namespace EmployeeWelfare.API.Models;

public class Dependent
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty; // Child, Parent, Spouse, In-law
    public DateTime DateOfBirth { get; set; }
    public string CareResponsibilities { get; set; } = string.Empty;
}