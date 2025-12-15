using API.DTOs.OrderDTOs;
using FluentValidation;

namespace API.Validation.OrderValidations;

public class UpdateOrderValidator : AbstractValidator<OrderUpdateDTO>
{
    public UpdateOrderValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid order status");
    }
}
