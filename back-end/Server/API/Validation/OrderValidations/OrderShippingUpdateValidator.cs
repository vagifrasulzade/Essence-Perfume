using API.DTOs.OrderDTOs;
using FluentValidation;

namespace API.Validation.OrderValidations;

public class OrderShippingUpdateValidator : AbstractValidator<OrderShippingUpdateDTO>
{
    public OrderShippingUpdateValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .NotNull().WithMessage("First name is required")
            .MinimumLength(2).WithMessage("First name must be at least 2 characters")
            .MaximumLength(50).WithMessage("First name must not exceed 50 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .NotNull().WithMessage("Last name is required")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters")
            .MaximumLength(50).WithMessage("Last name must not exceed 50 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .NotNull().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(60).WithMessage("Email must not exceed 60 characters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .NotNull().WithMessage("Phone is required")
            .MaximumLength(20).WithMessage("Phone must not exceed 20 characters");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .NotNull().WithMessage("Address is required")
            .MinimumLength(5).WithMessage("Address must be at least 5 characters")
            .MaximumLength(200).WithMessage("Address must not exceed 200 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .NotNull().WithMessage("City is required")
            .MinimumLength(2).WithMessage("City must be at least 2 characters")
            .MaximumLength(50).WithMessage("City must not exceed 50 characters");

        RuleFor(x => x.ZipCode)
            .NotEmpty().WithMessage("Zip code is required")
            .NotNull().WithMessage("Zip code is required")
            .MaximumLength(20).WithMessage("Zip code must not exceed 20 characters");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required")
            .NotNull().WithMessage("Country is required")
            .MinimumLength(2).WithMessage("Country must be at least 2 characters")
            .MaximumLength(50).WithMessage("Country must not exceed 50 characters");
    }
}

