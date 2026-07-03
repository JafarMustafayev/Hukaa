namespace Tetra.Application.Options.Validation.Settings;

public class UpdateProfileValidationOptions
{
    public StringValidationRule FirstName { get; set; } = new();
    public StringValidationRule LastName { get; set; } = new();
    public StringValidationRule Bio { get; set; } = new();
    public StringValidationRule Website { get; set; } = new();
    public IntValidationRule Gender { get; set; } = new();
    public DateTimeValidationRule Birthday { get; set; } = new();
}