using EmployeeWelfare.API.Models;

namespace EmployeeWelfare.API.Data;

public static class SeedAccounts
{
    public static HRAdministrator GetHRAdmin()
    {
        return new HRAdministrator
        {
            FullName = "Sarah Njoroge",
            Email = "hr@northbridge.com",
            PasswordHash = "hr123"
        };
    }

    public static List<Employee> GetEmployees()
    {
        return new List<Employee>
        {
            new()
            {
                FullName = "David Mensah",
                Email = "david@northbridge.com",
                PasswordHash = "david123",
                EmployeeCode = "NB-20481",
                Department = "Operations",
                Position = "Logistics Coordinator",
                EmploymentType = "Full-time",
                DateJoined = new DateTime(2018, 5, 2, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active",
                Age = 38,
                Gender = "Male",
                MaritalStatus = "Married"
            },
            new()
            {
                FullName = "Mary Wanjiru",
                Email = "mary@northbridge.com",
                PasswordHash = "mary123",
                EmployeeCode = "NB-20482",
                Department = "Finance",
                Position = "Accountant",
                EmploymentType = "Full-time",
                DateJoined = new DateTime(2019, 8, 1, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active",
                Age = 44,
                Gender = "Female",
                MaritalStatus = "Married"
            },
            new()
            {
                FullName = "James Otieno",
                Email = "james@northbridge.com",
                PasswordHash = "james123",
                EmployeeCode = "NB-20483",
                Department = "IT",
                Position = "Software Developer",
                EmploymentType = "Full-time",
                DateJoined = new DateTime(2021, 11, 20, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active",
                Age = 46,
                Gender = "Male",
                MaritalStatus = "Single"
            }
        };
    }
}