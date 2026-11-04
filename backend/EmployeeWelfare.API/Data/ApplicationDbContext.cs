using Microsoft.EntityFrameworkCore;
using EmployeeWelfare.API.Models;

namespace EmployeeWelfare.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Employee> Employees { get; set; }
    public DbSet<EmployeeWelfareInfo> EmployeeWelfareInfos { get; set; }
    public DbSet<Dependent> Dependents { get; set; }
    public DbSet<LifeEvent> LifeEvents { get; set; }
    public DbSet<WelfareProgram> WelfarePrograms { get; set; }
    public DbSet<Recommendation> Recommendations { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Alert> Alerts { get; set; }
    public DbSet<HRAdministrator> HRAdministrators { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // One-to-one: Employee <-> EmployeeWelfareInfo
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.WelfareInfo)
            .WithOne(w => w.Employee)
            .HasForeignKey<EmployeeWelfareInfo>(w => w.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        // One-to-many: Employee -> Alerts
        modelBuilder.Entity<Alert>()
            .HasOne(a => a.Employee)
            .WithMany(e => e.Alerts)
            .HasForeignKey(a => a.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}