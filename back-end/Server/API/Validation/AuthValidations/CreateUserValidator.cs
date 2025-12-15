using API.DTOs.AuthDTOs;
using FluentValidation;

namespace API.Validation.AuthValidations;

public class CreateUserValidator : AbstractValidator<CreateUserDTO>
{
    public CreateUserValidator()
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



        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Password is required!")
            .MinimumLength(8).WithMessage("Password should be at least 8 characters long!")
            .MaximumLength(150).WithMessage("Password should not be more than 150 characters!")
            .Matches(@"^(?=.*\d)[A-Z].{7,}$")
            .WithMessage("Password must start with an uppercase letter and contain at least one digit.");




        RuleFor(u => u.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm Password is required!")
            .Equal(u => u.Password)
            .WithMessage("Confirm Password must match Password.")
            .Matches(@"^(?=.*\d)[A-Z].{7,}$")
            .WithMessage("Confirm Password must start with an uppercase letter and contain at least one digit.");



    }
}
