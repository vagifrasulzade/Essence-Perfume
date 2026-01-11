using API.Models;
using API.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVolume> ProductVolume => Set<ProductVolume>();

    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    public DbSet<ProductNotes> ProductNotes => Set<ProductNotes>();

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderShipping> OrderShippings => Set<OrderShipping>();

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<Favorite> Favorites => Set<Favorite>();

    public async Task ResetContactMessagesIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('ContactMessages', RESEED, 0);");
    }

    public async Task ResetProductsIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Products', RESEED, 0);");
    }

    public async Task ResetUsersIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Users', RESEED, 0);");
    }

    public async Task ResetOrderItemsIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('OrderItems', RESEED, 0);");
    }

    public async Task ResetOrderShippingsIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('OrderShippings', RESEED, 0);");
    }

    public async Task ResetProductVolumesIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('ProductVolume', RESEED, 0);");
    }

    public async Task ResetProductImagesIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('ProductImages', RESEED, 0);");
    }

    public async Task ResetProductNotesIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('ProductNotes', RESEED, 0);");
    }

    public async Task ResetCartsIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Carts', RESEED, 0);");
    }

    public async Task ResetFavoritesIdentityAsync()
    {
        await Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Favorites', RESEED, 0);");
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Track which entity types were deleted BEFORE SaveChanges
        var deletedEntityTypes = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Deleted)
            .Select(e => e.Entity.GetType())
            .Distinct()
            .ToList();

        var result = await base.SaveChangesAsync(cancellationToken);

        // Only check identity reset and renumbering for tables where entities were deleted
        if (deletedEntityTypes.Any())
        {
            await ResetIdentityIfEmptyAsync(deletedEntityTypes);
            await RenumberIdsAsync(deletedEntityTypes);
        }

        return result;
    }

    private async Task RenumberIdsAsync(List<Type> deletedEntityTypes)
    {
        // Renumber Products
        if (deletedEntityTypes.Contains(typeof(Product)))
        {
            await RenumberProductsAsync();
        }

        // Renumber Users
        if (deletedEntityTypes.Contains(typeof(User)))
        {
            await RenumberUsersAsync();
        }

        // Renumber OrderItems
        if (deletedEntityTypes.Contains(typeof(OrderItem)))
        {
            await RenumberOrderItemsAsync();
        }

        // Renumber OrderShippings
        if (deletedEntityTypes.Contains(typeof(OrderShipping)))
        {
            await RenumberOrderShippingsAsync();
        }

        // Renumber ProductVolume
        if (deletedEntityTypes.Contains(typeof(ProductVolume)))
        {
            await RenumberProductVolumesAsync();
        }

        // Renumber ProductImages
        if (deletedEntityTypes.Contains(typeof(ProductImage)))
        {
            await RenumberProductImagesAsync();
        }

        // Renumber ProductNotes
        if (deletedEntityTypes.Contains(typeof(ProductNotes)))
        {
            await RenumberProductNotesAsync();
        }

        // Renumber Carts
        if (deletedEntityTypes.Contains(typeof(Cart)))
        {
            await RenumberCartsAsync();
        }

        // Renumber Favorites
        if (deletedEntityTypes.Contains(typeof(Favorite)))
        {
            await RenumberFavoritesAsync();
        }

        // Renumber ContactMessages
        if (deletedEntityTypes.Contains(typeof(ContactMessage)))
        {
            await RenumberContactMessagesAsync();
        }
    }

    private async Task RenumberProductsAsync()
    {
        var products = await Products.OrderBy(p => p.Id).ToListAsync();
        if (!products.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var product in products)
        {
            if (product.Id != newId)
            {
                idMapping[product.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            // Update foreign keys first
            foreach (var mapping in idMapping)
            {
                // Update ProductVolume
                var volumes = await ProductVolume.Where(v => v.ProductId == mapping.Key).ToListAsync();
                foreach (var volume in volumes)
                {
                    volume.ProductId = mapping.Value;
                }

                // Update ProductImages
                var images = await ProductImages.Where(i => i.ProductId == mapping.Key).ToListAsync();
                foreach (var image in images)
                {
                    image.ProductId = mapping.Value;
                }

                // Update ProductNotes
                var notes = await ProductNotes.Where(n => n.ProductId == mapping.Key).ToListAsync();
                foreach (var note in notes)
                {
                    note.ProductId = mapping.Value;
                }

                // Update Carts
                var carts = await Carts.Where(c => c.ProductId == mapping.Key).ToListAsync();
                foreach (var cart in carts)
                {
                    cart.ProductId = mapping.Value;
                }

                // Update Favorites
                var favorites = await Favorites.Where(f => f.ProductId == mapping.Key).ToListAsync();
                foreach (var favorite in favorites)
                {
                    favorite.ProductId = mapping.Value;
                }
            }

            // Update Products
            foreach (var mapping in idMapping)
            {
                var product = products.First(p => p.Id == mapping.Key);
                product.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetProductsIdentityAsync();
        }
    }

    private async Task RenumberUsersAsync()
    {
        var users = await Users.OrderBy(u => u.Id).ToListAsync();
        if (!users.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var user in users)
        {
            if (user.Id != newId)
            {
                idMapping[user.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            // Update foreign keys first
            foreach (var mapping in idMapping)
            {
                // Update Carts
                var carts = await Carts.Where(c => c.UserId == mapping.Key).ToListAsync();
                foreach (var cart in carts)
                {
                    cart.UserId = mapping.Value;
                }

                // Update Favorites
                var favorites = await Favorites.Where(f => f.UserId == mapping.Key).ToListAsync();
                foreach (var favorite in favorites)
                {
                    favorite.UserId = mapping.Value;
                }

                // Update Orders
                var orders = await Orders.Where(o => o.UserId == mapping.Key).ToListAsync();
                foreach (var order in orders)
                {
                    order.UserId = mapping.Value;
                }
            }

            // Update Users
            foreach (var mapping in idMapping)
            {
                var user = users.First(u => u.Id == mapping.Key);
                user.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetUsersIdentityAsync();
        }
    }

    private async Task RenumberOrderItemsAsync()
    {
        var items = await OrderItems.OrderBy(i => i.Id).ToListAsync();
        if (!items.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var item in items)
        {
            if (item.Id != newId)
            {
                idMapping[item.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var item = items.First(i => i.Id == mapping.Key);
                item.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetOrderItemsIdentityAsync();
        }
    }

    private async Task RenumberOrderShippingsAsync()
    {
        var shippings = await OrderShippings.OrderBy(s => s.Id).ToListAsync();
        if (!shippings.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var shipping in shippings)
        {
            if (shipping.Id != newId)
            {
                idMapping[shipping.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var shipping = shippings.First(s => s.Id == mapping.Key);
                shipping.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetOrderShippingsIdentityAsync();
        }
    }

    private async Task RenumberProductVolumesAsync()
    {
        var volumes = await ProductVolume.OrderBy(v => v.Id).ToListAsync();
        if (!volumes.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var volume in volumes)
        {
            if (volume.Id != newId)
            {
                idMapping[volume.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var volume = volumes.First(v => v.Id == mapping.Key);
                volume.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetProductVolumesIdentityAsync();
        }
    }

    private async Task RenumberProductImagesAsync()
    {
        var images = await ProductImages.OrderBy(i => i.Id).ToListAsync();
        if (!images.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var image in images)
        {
            if (image.Id != newId)
            {
                idMapping[image.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var image = images.First(i => i.Id == mapping.Key);
                image.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetProductImagesIdentityAsync();
        }
    }

    private async Task RenumberProductNotesAsync()
    {
        var notes = await ProductNotes.OrderBy(n => n.Id).ToListAsync();
        if (!notes.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var note in notes)
        {
            if (note.Id != newId)
            {
                idMapping[note.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var note = notes.First(n => n.Id == mapping.Key);
                note.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetProductNotesIdentityAsync();
        }
    }

    private async Task RenumberCartsAsync()
    {
        var carts = await Carts.OrderBy(c => c.Id).ToListAsync();
        if (!carts.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var cart in carts)
        {
            if (cart.Id != newId)
            {
                idMapping[cart.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var cart = carts.First(c => c.Id == mapping.Key);
                cart.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetCartsIdentityAsync();
        }
    }

    private async Task RenumberFavoritesAsync()
    {
        var favorites = await Favorites.OrderBy(f => f.Id).ToListAsync();
        if (!favorites.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var favorite in favorites)
        {
            if (favorite.Id != newId)
            {
                idMapping[favorite.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var favorite = favorites.First(f => f.Id == mapping.Key);
                favorite.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetFavoritesIdentityAsync();
        }
    }

    private async Task RenumberContactMessagesAsync()
    {
        var messages = await ContactMessages.OrderBy(m => m.Id).ToListAsync();
        if (!messages.Any()) return;

        var idMapping = new Dictionary<int, int>();
        int newId = 1;

        foreach (var message in messages)
        {
            if (message.Id != newId)
            {
                idMapping[message.Id] = newId;
            }
            newId++;
        }

        if (idMapping.Any())
        {
            foreach (var mapping in idMapping)
            {
                var message = messages.First(m => m.Id == mapping.Key);
                message.Id = mapping.Value;
            }

            await base.SaveChangesAsync();
            await ResetContactMessagesIdentityAsync();
        }
    }

    private async Task ResetIdentityIfEmptyAsync(List<Type> deletedEntityTypes)
    {
        // Check Products
        if (deletedEntityTypes.Contains(typeof(Product)) && await Products.CountAsync() == 0)
        {
            await ResetProductsIdentityAsync();
        }

        // Check Users
        if (deletedEntityTypes.Contains(typeof(User)) && await Users.CountAsync() == 0)
        {
            await ResetUsersIdentityAsync();
        }

        // Check OrderItems
        if (deletedEntityTypes.Contains(typeof(OrderItem)) && await OrderItems.CountAsync() == 0)
        {
            await ResetOrderItemsIdentityAsync();
        }

        // Check OrderShippings
        if (deletedEntityTypes.Contains(typeof(OrderShipping)) && await OrderShippings.CountAsync() == 0)
        {
            await ResetOrderShippingsIdentityAsync();
        }

        // Check ProductVolume
        if (deletedEntityTypes.Contains(typeof(ProductVolume)) && await ProductVolume.CountAsync() == 0)
        {
            await ResetProductVolumesIdentityAsync();
        }

        // Check ProductImages
        if (deletedEntityTypes.Contains(typeof(ProductImage)) && await ProductImages.CountAsync() == 0)
        {
            await ResetProductImagesIdentityAsync();
        }

        // Check ProductNotes
        if (deletedEntityTypes.Contains(typeof(ProductNotes)) && await ProductNotes.CountAsync() == 0)
        {
            await ResetProductNotesIdentityAsync();
        }

        // Check Carts
        if (deletedEntityTypes.Contains(typeof(Cart)) && await Carts.CountAsync() == 0)
        {
            await ResetCartsIdentityAsync();
        }

        // Check Favorites
        if (deletedEntityTypes.Contains(typeof(Favorite)) && await Favorites.CountAsync() == 0)
        {
            await ResetFavoritesIdentityAsync();
        }

        // Check ContactMessages
        if (deletedEntityTypes.Contains(typeof(ContactMessage)) && await ContactMessages.CountAsync() == 0)
        {
            await ResetContactMessagesIdentityAsync();
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Order with String Id (ORD-Guid format)
        modelBuilder.Entity<Order>()
            .Property(o => o.Id)
            .HasMaxLength(50)
            .ValueGeneratedNever(); // We generate the ID manually

        // TODO: Configure Gender as string - Migration needed
        // Uncomment after running migration to convert Gender from int to string
        // modelBuilder.Entity<Product>()
        //     .Property(p => p.Gender)
        //     .HasConversion<string>()
        //     .HasMaxLength(20);

        // Product - ProductNotes (One-to-One)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Notes)
            .WithOne(n => n.Product)
            .HasForeignKey<ProductNotes>(n => n.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product - ProductVolume (One-to-Many)
        modelBuilder.Entity<Product>()
            .HasMany(p => p.Volumes)
            .WithOne(v => v.Product)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product - ProductImage (One-to-Many)
        modelBuilder.Entity<Product>()
            .HasMany(p => p.Images)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignore DiscountPercentage on Product (column doesn't exist in database)
        modelBuilder.Entity<Product>()
            .Ignore(p => p.DiscountPercentage);

        // Order - OrderItem (One-to-Many)
        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Order - OrderShipping (One-to-One)
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Shipping)
            .WithOne(s => s.Order)
            .HasForeignKey<OrderShipping>(s => s.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // User - Cart (One-to-Many)
        modelBuilder.Entity<Cart>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product - Cart (One-to-Many)
        modelBuilder.Entity<Cart>()
            .HasOne(c => c.Product)
            .WithMany()
            .HasForeignKey(c => c.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // User - Favorite (One-to-Many)
        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany()
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product - Favorite (One-to-Many)
        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Product)
            .WithMany()
            .HasForeignKey(f => f.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique constraint: User can have only one cart item per product and volume
        modelBuilder.Entity<Cart>()
            .HasIndex(c => new { c.UserId, c.ProductId, c.Volume })
            .IsUnique();
    }
}
