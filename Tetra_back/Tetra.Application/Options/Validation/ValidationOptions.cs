namespace Tetra.Application.Options.Validation;

public sealed class ValidationOptions
{
    public AuthValidationOptions Auth { get; set; } = new();
    public TwoFactorValidationOptions TwoFactor { get; set; } = new();
    public SettingsValidationOptions Settings { get; set; } = new();
}