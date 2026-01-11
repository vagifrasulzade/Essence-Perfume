-- Migration: Add DiscountPercentage column to ProductVolumes table
-- Run this SQL script directly on your database

IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[ProductVolumes]') 
    AND name = 'DiscountPercentage'
)
BEGIN
    ALTER TABLE [dbo].[ProductVolumes]
    ADD [DiscountPercentage] decimal(18,2) NOT NULL DEFAULT 0;
    
    PRINT 'DiscountPercentage column added successfully to ProductVolumes table.';
END
ELSE
BEGIN
    PRINT 'DiscountPercentage column already exists in ProductVolumes table.';
END
GO



