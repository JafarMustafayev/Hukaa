namespace Tetra.API.Controllers;

[ApiController]
[Route("api/auth/[controller]")]
public class SessionController(
    ISessionService sessionService) : ControllerBase
{
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyActiveSessions()
    {
        var res = sessionService.GetMyActiveSessions();
        return StatusCode(res.StatusCode, res);
    }

    [Authorize]
    [HttpDelete("{sessionId}")]
    public async Task<IActionResult> DeleteSession(string sessionId)
    {
        var res = await sessionService.RevokeSessionAsync(sessionId);
        return StatusCode(res.StatusCode, res);
    }

    [Authorize]
    [HttpPost("revoke-others")]
    public async Task<IActionResult> RevokeOthers()
    {
        var res = await sessionService.RevokeAllExceptCurrentAsync();
        return StatusCode(res.StatusCode, res);
    }
}