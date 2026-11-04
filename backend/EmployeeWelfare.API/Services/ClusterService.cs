using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace EmployeeWelfare.API.Services;

public class ClusterService
{
    private readonly HttpClient _http;
    private readonly ILogger<ClusterService> _log;
    private readonly string _baseUrl;

    public ClusterService(HttpClient http, IConfiguration cfg, ILogger<ClusterService> log)
    {
        _http = http;
        _log = log;
        // Defaults to localhost:8000 (your Python service)
        _baseUrl = cfg["MlService:BaseUrl"] ?? "http://localhost:8000";
    }

    public async Task<(int clusterId, string clusterLabel)> PredictAsync(
        int numberOfDependents,
        int childrenCount,
        int elderlyDependents,
        int caregivingResponsibility,
        int financialDifficulty,
        int elderlyCareNeed,
        int educationSupportNeed,
        int bereavementRecent)
    {
        // 1. Build the payload matching the Python Pydantic model exactly
        var payload = new
        {
            number_of_dependents = numberOfDependents,
            children_count = childrenCount,
            elderly_dependents = elderlyDependents,
            caregiving_responsibility = caregivingResponsibility,
            financial_difficulty = financialDifficulty,
            elderly_care_need = elderlyCareNeed,
            education_support_need = educationSupportNeed,
            bereavement_recent = bereavementRecent,
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            // 2. Call the Python API
            var response = await _http.PostAsync($"{_baseUrl}/predict", content);
            if (!response.IsSuccessStatusCode)
            {
                _log.LogWarning("ML service returned {Status}", response.StatusCode);
                return (-1, "Unassigned");
            }

            // 3. Read the response
            var result = await response.Content.ReadFromJsonAsync<ClusterResponse>();
            return (result?.clusterId ?? -1, result?.clusterLabel ?? "Unassigned");
        }
        catch (Exception ex)
        {
            // If Python is down, don't crash the C# app. Just save as Unassigned.
            _log.LogWarning(ex, "ML service call failed. Falling back to Unassigned.");
            return (-1, "Unassigned");
        }
    }

    private class ClusterResponse
    {
        [JsonPropertyName("clusterId")]   public int clusterId { get; set; }
        [JsonPropertyName("clusterLabel")] public string clusterLabel { get; set; } = "";
    }
}