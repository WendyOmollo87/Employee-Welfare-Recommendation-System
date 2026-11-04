using EmployeeWelfare.API.Data;
using EmployeeWelfare.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeWelfare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmployeesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/employees
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
    {
        return await _context.Employees
            .Include(e => e.WelfareInfo)
            .Include(e => e.Dependents)
            .ToListAsync();
    }

    // GET: api/employees/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Employee>> GetEmployee(int id)
    {
        var employee = await _context.Employees
            .Include(e => e.WelfareInfo)
            .Include(e => e.Dependents)
            .Include(e => e.LifeEvents)
            .Include(e => e.Alerts)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (employee == null) return NotFound();
        return employee;
    }

    // POST: api/employees
    // HR enrolls a new employee. Generates a temporary password.
    [HttpPost]
    public async Task<ActionResult> CreateEmployee(Employee employee)
    {
        var tempPassword = "welcome" + new Random().Next(1000, 9999);

        employee.PasswordHash = tempPassword;
        employee.TempPassword = tempPassword;
        employee.MustChangePassword = true;
        employee.OnboardingComplete = false;
        employee.ClusterId = -1;
        employee.ClusterLabel = "Unassigned";
        employee.CreatedAt = DateTime.UtcNow;

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            employee.Id,
            employee.Email,
            employee.FullName,
            employee.EmployeeCode,
            TempPassword = tempPassword,
            Message = "Employee enrolled. Share the temporary password."
        });
    }

    // PUT: api/employees/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
    {
        if (id != employee.Id) return BadRequest();
        _context.Entry(employee).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Employees.Any(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/employees/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return NotFound();

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PUT: api/employees/5/password
    // Employee changes their temporary password on first login.
    [HttpPut("{id}/password")]
    public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest request)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return NotFound();

        if (employee.PasswordHash != request.CurrentPassword)
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }

        employee.PasswordHash = request.NewPassword;
        employee.MustChangePassword = false;
        employee.TempPassword = null;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Password updated." });
    }

    // PUT: api/employees/5/onboarding-complete
    // Marks the employee as having completed the onboarding questionnaire.
    [HttpPut("{id}/onboarding-complete")]
    public async Task<IActionResult> CompleteOnboarding(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return NotFound();

        employee.OnboardingComplete = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Onboarding complete." });
    }

    // POST: api/employees/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // HR Admin
        var hr = await _context.HRAdministrators
            .FirstOrDefaultAsync(h => h.Email == request.Email);

        if (hr != null && hr.PasswordHash == request.Password)
        {
            return Ok(new
            {
                role = "hr",
                id = hr.Id,
                name = hr.FullName,
                email = hr.Email
            });
        }

        // Employee
        var emp = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == request.Email);

        if (emp != null && emp.PasswordHash == request.Password)
        {
            return Ok(new
            {
                role = "employee",
                id = emp.Id,
                name = emp.FullName,
                email = emp.Email,
                employeeCode = emp.EmployeeCode,
                department = emp.Department,
                mustChangePassword = emp.MustChangePassword,
                onboardingComplete = emp.OnboardingComplete
            });
        }

        return Unauthorized(new { message = "Invalid email or password." });
    }

    // POST: api/employees/seed
    [HttpPost("seed")]
    public async Task<IActionResult> SeedAccounts()
    {
        if (await _context.Employees.AnyAsync() || await _context.HRAdministrators.AnyAsync())
        {
            return BadRequest("Accounts already exist. Seed skipped.");
        }

        var hr = EmployeeWelfare.API.Data.SeedAccounts.GetHRAdmin();
        _context.HRAdministrators.Add(hr);

        var employees = EmployeeWelfare.API.Data.SeedAccounts.GetEmployees();
        _context.Employees.AddRange(employees);

        await _context.SaveChangesAsync();

        return Ok(new { hrAdmins = 1, employees = employees.Count });
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}