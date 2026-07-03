namespace Tetra.Application.Abstractions.Services.Profile;

public interface IProfileService
{
    Task<ResponseDto<UserProfileEditResponseDto>> GetProfileEditAsync();
    Task<ResponseDto<UserProfileEditResponseDto>> UpdateProfileAsync(UpdateUserProfileRequestDto request);
}