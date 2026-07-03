namespace Tetra.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController(
    IProfileService profileService) : ControllerBase
{

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfileData()
    {
        var res = await profileService.GetProfileEditAsync();
        return StatusCode(res.StatusCode, res);
    }

    [Authorize]
    [HttpPatch("profile")]
    public async Task<IActionResult> UpdateProfileAsync([FromForm] UpdateUserProfileRequestDto request)
    {
        var res = await profileService.UpdateProfileAsync(request);
        return StatusCode(res.StatusCode, res);
    }
}