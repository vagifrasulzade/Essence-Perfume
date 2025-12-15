using API.DTOs.AuthDTOs;
using FluentValidation;

namespace API.Validation.AuthValidations;

public class UpdateUserValidator: AbstractValidator<UpdateUserDTO>
{
    public UpdateUserValidator()
    {
        RuleFor(u => u.FirstName)
        .NotEmpty().WithMessage("First Name is Required !!")
        .NotNull().WithMessage("First Name is Required !!")
        .MinimumLength(2).WithMessage("First Name should not be Less Than 2 !!")
        .MaximumLength(50).WithMessage("First Name should not be More Than 50 !!");

        RuleFor(u => u.LastName)
            .MinimumLength(2).WithMessage("First Name should not be Less Than 2 !!")
            .MaximumLength(75).WithMessage("Last Name should not be More Than 75 !!");


        RuleFor(u => u.Email)
         .NotEmpty().WithMessage("Email is required!")
         .NotNull().WithMessage("Email is required!")
         .MinimumLength(12).WithMessage("Email should not be less than 12 characters (e.g., name@gmail.com)")
         .MaximumLength(60).WithMessage("Email should not be more than 60 characters (e.g., name@gmail.com)")
         .Matches(@"^[A-Za-z0-9._%+-]{1,64}@(gmail\.com|mail\.ru|outlook\.com|yahoo\.com|hotmail\.com)$")
         .WithMessage("Invalid email domain! Allowed domains: gmail.com, mail.ru, outlook.com, yahoo.com, hotmail.com");

        // Phone validation (optional but if provided, must be valid)
        RuleFor(u => u.Phone)
            .Matches(@"^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$")
            .When(u => !string.IsNullOrWhiteSpace(u.Phone))
            .WithMessage("Please enter a valid phone number");

        // Address validation (optional but if provided, must meet requirements)
        RuleFor(u => u.Address)
            .MinimumLength(5).WithMessage("Please enter a complete address")
            .When(u => !string.IsNullOrWhiteSpace(u.Address))
            .MaximumLength(200).WithMessage("Address should not be more than 200 characters");

        RuleFor(u => u.City)
            .MinimumLength(2).WithMessage("Please enter a valid city")
            .When(u => !string.IsNullOrWhiteSpace(u.City))
            .MaximumLength(100).WithMessage("City should not be more than 100 characters");

        RuleFor(u => u.State)
            .MinimumLength(2).WithMessage("Please enter a valid state")
            .When(u => !string.IsNullOrWhiteSpace(u.State))
            .MaximumLength(100).WithMessage("State should not be more than 100 characters");

        RuleFor(u => u.ZipCode)
            .Matches(@"^\d{4,10}$")
            .When(u => !string.IsNullOrWhiteSpace(u.ZipCode))
            .WithMessage("Please enter a valid ZIP code (4-10 digits)");

        RuleFor(u => u.Country)
            .MinimumLength(2).WithMessage("Please enter a valid country")
            .When(u => !string.IsNullOrWhiteSpace(u.Country))
            .MaximumLength(100).WithMessage("Country should not be more than 100 characters");
    }
}
