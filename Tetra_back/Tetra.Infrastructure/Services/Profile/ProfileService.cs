namespace Tetra.Infrastructure.Services.Profile;

public class ProfileService(
    IMapper mapper,
    IUnitOfWork unitOfWork,
    IJwtClaimsReader claimsReader,
    ILocalizationService localizer,
    IUserProfileReadRepository profileReadRepo,
    IUserProfileWriteRepository profileWriteRepo) : IProfileService
{
    public async Task<ResponseDto<UserProfileEditResponseDto>> GetProfileEditAsync()
    {
        var userId = claimsReader.GetUserId();
        var userData = await GetUserDataAsync(userId);

        var mapped = mapper.Map<UserProfileEditResponseDto>(userData);
        return ResponseDto<UserProfileEditResponseDto>.OkResponse(localizer.Get("Profile.GetProfile.Success"), mapped);
    }
    public async Task<ResponseDto<UserProfileEditResponseDto>> UpdateProfileAsync(UpdateUserProfileRequestDto request)
    {
        var userId = claimsReader.GetUserId();
        var userData = await GetUserDataAsync(userId);

        var mapped = mapper.Map<UpdateUserProfileRequestDto, UserProfile>(request, userData);
        //todo:sekilleri url olarq yazilmalidir 

        profileWriteRepo.Update(mapped);
        await unitOfWork.SaveChangesAsync();

        var responseData = mapper.Map<UserProfileEditResponseDto>(userData);

        return ResponseDto<UserProfileEditResponseDto>.OkResponse(localizer.Get("Profile.UpdateProfile.Success"), responseData);
    }

    private async Task<UserProfile> GetUserDataAsync(string? userId = null)
    {
        var userData = await profileReadRepo.FirstOrDefaultAsync(x => x.UserId == (userId ?? claimsReader.GetUserId()));
        if(userData == null)
        {
            throw new NotFoundException(localizer.Get("Error.Common.NotFoundWithParameter", "User",
                new Dictionary<string, object>
                {
                    ["Parameter"] = userId ?? claimsReader.GetUserId()
                }
            ));
        }

        return userData;
    }

}