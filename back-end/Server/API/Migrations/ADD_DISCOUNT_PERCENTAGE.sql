-- Migration: Add DiscountPercentage column to Products table
-- Run this SQL script directly on your database if dotnet ef migrations doesn't work

IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Products]') 
    AND name = 'DiscountPercentage'
)
BEGIN
    ALTER TABLE [dbo].[Products]
    ADD [DiscountPercentage] decimal(18,2) NOT NULL DEFAULT 0;
    
    PRINT 'DiscountPercentage column added successfully to Products table.';
END
ELSE
BEGIN
    PRINT 'DiscountPercentage column already exists in Products table.';
END
GO





