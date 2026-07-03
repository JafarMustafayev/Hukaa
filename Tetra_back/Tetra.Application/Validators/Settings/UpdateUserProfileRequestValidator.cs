namespace Tetra.Application.Validators.Settings;

public class UpdateUserProfileRequestValidator : AbstractValidator<UpdateUserProfileRequestDto>
{
    public UpdateUserProfileRequestValidator(
        IAppConfig appConfig,
        ILocalizationService localizer)
    {
        var rules = appConfig.GetSection<ValidationOptions>().Settings.UpdateProfile;

        RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.FirstName,
                localizer,
                "Username");

        RuleFor(x => x.LastName)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.LastName,
                localizer,
                "Username");

        RuleFor(x => x.Bio)
            .Cascade(CascadeMode.Stop)!
            .ApplyStringValidation(
                rules.Bio,
                localizer,
                "Username");

        RuleFor(x => x.Website)
            .Cascade(CascadeMode.Stop)!
            .ApplyStringValidation(
                rules.Website,
                localizer,
                "Username");

        RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)
            .ApplyStringValidation(
                rules.FirstName,
                localizer,
                "Username");
    }
}