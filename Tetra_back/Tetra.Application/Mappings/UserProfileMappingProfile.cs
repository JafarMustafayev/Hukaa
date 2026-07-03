namespace Tetra.Application.Mappings;

public class UserProfileMappingProfile : Profile
{
    public UserProfileMappingProfile()
    {
        CreateMap<User, CurrentUserDto>()
            .ForMember(des => des.AccentHue, opt => opt.MapFrom(src => src.Preferences.AccentHue))
            .ForMember(des => des.AvatarUrl, opt => opt.MapFrom(src => src.Profile.ProfileImageUrl))
            .ForMember(des => des.Name, opt => opt.MapFrom(src => $"{src.Profile.FirstName} {src.Profile.LastName}"))
            .ForMember(des => des.EmailVerified, opt => opt.MapFrom(src => src.EmailConfirmed))
            .ForMember(des => des.Theme, opt => opt.MapFrom(src => src.Preferences.Theme.ToString()));

        CreateMap<UserProfile, UserProfileEditResponseDto>();

        CreateMap<UpdateUserProfileRequestDto, UserProfile>()
            .ForMember(des => des.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(des => des.Birthday, opt => opt.Condition(src => src.Birthday != null));
    }
}