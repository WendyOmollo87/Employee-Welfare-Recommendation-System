namespace EmployeeWelfare.API.Models;

public class WelfareProgram
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string Eligibility { get; set; } = string.Empty;
    public string Coverage { get; set; } = string.Empty;
    public string HowToApply { get; set; } = string.Empty;
    public string Documents { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
    public string ProcessingTime { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Recommendation> Recommendations { get; set; } = new();
}