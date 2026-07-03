namespace Tetra.Application.DTOs.Profile;

public sealed class UpdateUserProfileRequestDto
{
    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public string? Bio { get; set; }
    public DateOnly? Birthday { get; set; }
    public string? Website { get; set; }
    public Gender? Gender { get; set; }
    public IFormFile? ProfileImage { get; set; }
    public IFormFile? CoverImage { get; set; }
}