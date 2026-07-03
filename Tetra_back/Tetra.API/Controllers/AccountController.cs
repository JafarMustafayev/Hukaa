namespace Tetra.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(
    IAccountService accountService) : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var res = await accountService.GetCurrentUserAsync();
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("check-email")]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        var res = await accountService.CheckEmailAvailabilityAsync(email);
        return StatusCode(res.StatusCode, res);
    }

    [HttpGet("check-username")]
    public async Task<IActionResult> CheckUsername([FromQuery] string username)
    {
        var res = await accountService.CheckUsernameAvailabilityAsync(username);
        return StatusCode(res.StatusCode, res);
    }

    [Authorize]
    [HttpPatch("username")]
    public async Task<IActionResult> ChangeUsername([FromBody] ChangeUsernameRequestDto request)
    {
        var res = await accountService.ChangeUsernameAsync(request);
        return StatusCode(res.StatusCode, res);
    }

    [Authorize]
    [HttpPatch("emailAddress")]
    public async Task<IActionResult> ChangeEmailAddress([FromBody] ChangeEmailRequestDto request)
    {
        var res = await accountService.ChangeEmailAsync(request);
        return StatusCode(res.StatusCode, res);
    }
}