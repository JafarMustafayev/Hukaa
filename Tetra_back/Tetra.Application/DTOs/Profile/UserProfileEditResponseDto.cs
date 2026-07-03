namespace Tetra.Application.DTOs.Profile;

public class UserProfileEditResponseDto
{
    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public string? Bio { get; init; }
    public DateOnly Birthday { get; init; }
    public string? Website { get; init; }
    public Gender? Gender { get; init; }

    public string? ProfileImageUrl { get; init; }
    public string? CoverImageUrl { get; init; }
}