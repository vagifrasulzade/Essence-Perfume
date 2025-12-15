using API.DTOs.AuthDTOs;
using FluentValidation;

namespace API.Validation.AuthValidations;

public class ChangePasswordValidator:AbstractValidator<ChangePasswordDTO>
{
    public ChangePasswordValidator()
    {
        // Current password should only be checked for not empty
        // Format validation is not needed because it's already stored in the database
        RuleFor(x => x.CurrentPassword)
             .NotEmpty().WithMessage("Current password is required.");

        // New password must follow the format rules
        RuleFor(x => x.NewPassword)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(8).WithMessage("New password must be at least 8 characters long.")
            .MaximumLength(150).WithMessage("New password must not exceed 150 characters.")
            .Matches(@"^(?=.*\d)[A-Z].{7,}$")
                .WithMessage("New password must start with an uppercase letter and contain at least one digit.")
            .NotEqual(x => x.CurrentPassword)
                .WithMessage("New password must be different from current password.");
    }
}
