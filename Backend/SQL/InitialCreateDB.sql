-- ===============================
-- CREATE DATABASE
-- ===============================
IF DB_ID('RefundSystemDb') IS NULL
BEGIN
    CREATE DATABASE RefundSystemDb;
END
GO

USE RefundSystemDb;
GO

-- ===============================
-- TABLE: Citizens
-- ===============================
CREATE TABLE dbo.Citizens (
    CitizenId INT IDENTITY(1,1) NOT NULL,
    FullName NVARCHAR(400) NOT NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT(GETDATE()),
    CONSTRAINT PK_Citizens PRIMARY KEY (CitizenId)
);
CREATE UNIQUE INDEX IX_Citizens_IdentityNumber ON dbo.Citizens(IdentityNumber);
GO

-- ===============================
-- TABLE: Clerks
-- ===============================
CREATE TABLE dbo.Clerks (
    Id INT IDENTITY(1,1) NOT NULL,
    Username NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2(7) NOT NULL DEFAULT(GETDATE()),
    CONSTRAINT PK_Clerks PRIMARY KEY (Id)
);
CREATE UNIQUE INDEX IX_Clerks_Username ON dbo.Clerks(Username);
GO

-- ===============================
-- TABLE: MonthlyBudgets
-- ===============================
CREATE TABLE dbo.MonthlyBudgets (
    Id INT IDENTITY(1,1) NOT NULL,
    Year INT NOT NULL,
    Month INT NOT NULL,
    TotalBudget DECIMAL(18,2) NOT NULL,
    UsedBudget DECIMAL(18,2) NOT NULL,
    RowVersion TIMESTAMP NOT NULL,
    CONSTRAINT PK_MonthlyBudgets PRIMARY KEY (Id),
    CONSTRAINT CK_MonthlyBudget_Month CHECK ([Month] >= 1 AND [Month] <= 12),
    CONSTRAINT CK_MonthlyBudget_Not_Over_Allocated CHECK ([UsedBudget] <= [TotalBudget]),
    CONSTRAINT CK_MonthlyBudget_Total_Positive CHECK ([TotalBudget] >= 0),
    CONSTRAINT CK_MonthlyBudget_Used_Not_Negative CHECK ([UsedBudget] >= 0)
);
CREATE UNIQUE INDEX IX_MonthlyBudgets_Year_Month ON dbo.MonthlyBudgets(Year, Month);
GO

-- ===============================
-- TABLE: MonthlyIncomes
-- ===============================
CREATE TABLE dbo.MonthlyIncomes (
    Id INT IDENTITY(1,1) NOT NULL,
    CitizenId INT NOT NULL,
    TaxYear INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Month INT NOT NULL,
    RowVersion TIMESTAMP NOT NULL,
    CONSTRAINT PK_MonthlyIncomes PRIMARY KEY (Id),
    CONSTRAINT CK_MonthlyIncome_Amount_Positive CHECK ([Amount] >= 0),
    CONSTRAINT CK_MonthlyIncome_Month CHECK ([Month] >= 1 AND [Month] <= 12),
    CONSTRAINT FK_MonthlyIncomes_Citizens_CitizenId FOREIGN KEY (CitizenId) REFERENCES dbo.Citizens(CitizenId)
);
CREATE INDEX IX_MonthlyIncomes_CitizenId ON dbo.MonthlyIncomes(CitizenId);
CREATE INDEX IX_MonthlyIncomes_CitizenId_TaxYear ON dbo.MonthlyIncomes(CitizenId, TaxYear);
CREATE UNIQUE INDEX IX_MonthlyIncomes_CitizenId_Month ON dbo.MonthlyIncomes(CitizenId, Month);
GO

-- ===============================
-- TABLE: RefundRequests
-- ===============================
CREATE TABLE dbo.RefundRequests (
    Id INT IDENTITY(1,1) NOT NULL,
    CitizenId INT NOT NULL,
    RequestDate DATETIME2(7) NOT NULL DEFAULT(GETDATE()),
    Amount DECIMAL(18,2) NOT NULL,
    RowVersion TIMESTAMP NOT NULL,
    CONSTRAINT PK_RefundRequests PRIMARY KEY (Id),
    CONSTRAINT FK_RefundRequests_Citizens_CitizenId FOREIGN KEY (CitizenId) REFERENCES dbo.Citizens(CitizenId)
);
GO

-- ===============================
-- TABLE: ClerkDecisions
-- ===============================
CREATE TABLE dbo.ClerkDecisions (
    Id INT IDENTITY(1,1) NOT NULL,
    RequestId INT NOT NULL,
    ClerkId INT NOT NULL,
    Decision INT NOT NULL,
    ApprovedAmount DECIMAL(18,2) NOT NULL,
    DecisionDate DATETIME2(7) NOT NULL DEFAULT(GETDATE()),
    CONSTRAINT PK_ClerkDecisions PRIMARY KEY (Id),
    CONSTRAINT FK_ClerkDecisions_RefundRequests_RequestId FOREIGN KEY (RequestId) REFERENCES dbo.RefundRequests(Id)
);
CREATE INDEX IX_ClerkDecisions_RequestId ON dbo.ClerkDecisions(RequestId);
GO

-- ===============================
-- TABLE: EFMigrationsHistory
-- ===============================
CREATE TABLE dbo.[EFMigrations History] (
    MigrationId NVARCHAR(150) NOT NULL,
    ProductVersion NVARCHAR(32) NOT NULL,
    CONSTRAINT PK_EFMigrationsHistory PRIMARY KEY (MigrationId)
);
GO

