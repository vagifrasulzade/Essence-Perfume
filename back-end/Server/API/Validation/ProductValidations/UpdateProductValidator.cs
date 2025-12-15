namespace API.Validation.ProductValidations;

using API.DTOs.ProductDTOs;
using FluentValidation;

public class UpdateProductValidator : AbstractValidator<ProductUpdateDTO>
{
    public UpdateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required.")
            .MaximumLength(100).WithMessage("Product name cannot exceed 100 characters.");

        RuleFor(x => x.Brand)
            .NotEmpty().WithMessage("Brand is required.")
            .MaximumLength(50).WithMessage("Brand cannot exceed 50 characters.");

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Gender is not valid.");

        RuleFor(x => x.Top)
            .NotNull().WithMessage("Top notes must be provided.");
        RuleForEach(x => x.Top)
            .NotEmpty().WithMessage("Top note cannot be empty.");

        RuleFor(x => x.Heart)
            .NotNull().WithMessage("Heart notes must be provided.");
        RuleForEach(x => x.Heart)
            .NotEmpty().WithMessage("Heart note cannot be empty.");

        RuleFor(x => x.Base)
            .NotNull().WithMessage("Base notes must be provided.");
        RuleForEach(x => x.Base)
            .NotEmpty().WithMessage("Base note cannot be empty.");

        RuleFor(x => x.Images)
            .NotNull().WithMessage("At least one image is required.")
            .Must(images => images != null && images.Count > 0)
            .WithMessage("At least one image is required.");

        RuleForEach(x => x.Images)
            .SetValidator(new ProductImageUpdateValidator());

        RuleFor(x => x.Volumes)
            .NotNull().WithMessage("At least one volume is required.")
            .Must(vols => vols != null && vols.Count > 0)
            .WithMessage("At least one volume is required.");

        RuleForEach(x => x.Volumes)
            .SetValidator(new ProductVolumeUpdateValidator());
    }
}

public class ProductImageUpdateValidator : AbstractValidator<ProductImageUpdateDTO>
{
    public ProductImageUpdateValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("Image URL is required.")
            .MaximumLength(2000).WithMessage("Image URL cannot exceed 2000 characters.");

        RuleFor(x => x.Sort)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be zero or a positive integer.");
    }
}

public class ProductVolumeUpdateValidator : AbstractValidator<ProductVolumeUpdateDTO>
{
    public ProductVolumeUpdateValidator()
    {
        RuleFor(x => x.Size)
            .GreaterThan(0).WithMessage("Volume size must be greater than 0.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be zero or positive.");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Stock must be zero or positive.");
    }
}
