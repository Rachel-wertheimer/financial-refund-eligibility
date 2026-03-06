CREATE OR ALTER PROCEDURE CalculateRefund 
    @RequestId INT,
    @ClerkId INT,
    @Approve BIT -- 1 = לאשר, 0 = לדחות
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE 
            @CitizenId INT,
            @TaxYear INT,
            @AverageIncome DECIMAL(18,2),
            @RefundAmount DECIMAL(18,2) = 0,
            @MonthCount INT,
            @BudgetYear INT,
            @BudgetMonth INT,
            @AvailableBudget DECIMAL(18,2),
            @TotalBudget DECIMAL(18,2),
            @UsedBudget DECIMAL(18,2);

        -- =========================================
        -- שליפת פרטי הבקשה (נעילה)
        -- =========================================
        SELECT 
            @CitizenId = CitizenId,
            @TaxYear = TaxYear
        FROM RefundRequests WITH (UPDLOCK, HOLDLOCK)
        WHERE Id = @RequestId
        AND Status = 0; -- ממתין

        IF @CitizenId IS NULL
            THROW 50001, 'בקשה לא קיימת או לא במצב ממתין', 1;

        -- =========================================
        -- בדיקה: אין בקשה מאושרת נוספת לאותה שנה
        -- =========================================
        IF EXISTS (
            SELECT 1
            FROM RefundRequests
            WHERE CitizenId = @CitizenId
            AND TaxYear = @TaxYear
            AND Status = 2 -- מאושר
            AND Id <> @RequestId
        )
            THROW 50002, 'קיימת כבר בקשה מאושרת לשנה זו', 1;

        -- =========================================
        -- בדיקה: לפחות 6 חודשי הכנסה
        -- =========================================
        SELECT 
            @MonthCount = COUNT(*),
            @AverageIncome = AVG(Amount)
        FROM MonthlyIncomes
        WHERE CitizenId = @CitizenId
        AND TaxYear = @TaxYear;

        IF @MonthCount < 6
            THROW 50003, 'נדרשים לפחות 6 חודשי הכנסה', 1;

        -- =========================================
        -- חישוב מדרגות מצטבר
        -- =========================================
        DECLARE @Remaining DECIMAL(18,2) = @AverageIncome;

        -- מדרגה 1 עד 5000 – 15%
        IF @Remaining > 0
        BEGIN
            DECLARE @Tier1 DECIMAL(18,2) = 
                CASE WHEN @Remaining > 5000 THEN 5000 ELSE @Remaining END;

            SET @RefundAmount += @Tier1 * 0.15;
            SET @Remaining -= @Tier1;
        END

        -- מדרגה 2 עד 8000 – 10%
        IF @Remaining > 0
        BEGIN
            DECLARE @Tier2 DECIMAL(18,2) =
                CASE WHEN @Remaining > 3000 THEN 3000 ELSE @Remaining END;

            SET @RefundAmount += @Tier2 * 0.10;
            SET @Remaining -= @Tier2;
        END

        -- מדרגה 3 עד 9000 – 5%
        IF @Remaining > 0
        BEGIN
            DECLARE @Tier3 DECIMAL(18,2) =
                CASE WHEN @Remaining > 1000 THEN 1000 ELSE @Remaining END;

            SET @RefundAmount += @Tier3 * 0.05;
        END

        -- מעל 9000 אין החזר

        -- =========================================
        -- עדכון סכום מחושב
        -- =========================================
        UPDATE RefundRequests
        SET CalculatedAmount = @RefundAmount
        WHERE Id = @RequestId;

        -- =========================================
        -- אם נדחה
        -- =========================================
        IF @Approve = 0
        BEGIN
            UPDATE RefundRequests
            SET Status = 3 -- נדחה
            WHERE Id = @RequestId;

            COMMIT;
            RETURN;
        END

        -- =========================================
        -- בדיקת תקציב חודשי (נעילה למניעת כפילות)
        -- =========================================
        SET @BudgetYear = YEAR(GETDATE());
        SET @BudgetMonth = MONTH(GETDATE());

        SELECT 
            @TotalBudget = TotalBudget,
            @UsedBudget = UsedBudget
        FROM MonthlyBudgets WITH (UPDLOCK, HOLDLOCK)
        WHERE Year = @BudgetYear
        AND Month = @BudgetMonth;

        IF @TotalBudget IS NULL
            THROW 50004, 'לא הוגדר תקציב לחודש הנוכחי', 1;

        SET @AvailableBudget = @TotalBudget - @UsedBudget;

        IF @AvailableBudget < @RefundAmount
            THROW 50005, 'אין מספיק תקציב זמין', 1;

        -- =========================================
        -- עדכון תקציב
        -- =========================================
        UPDATE MonthlyBudgets
        SET UsedBudget = UsedBudget + @RefundAmount
        WHERE Year = @BudgetYear
        AND Month = @BudgetMonth;

        -- =========================================
        -- אישור הבקשה
        -- =========================================
        UPDATE RefundRequests
        SET Status = 2, -- מאושר
            ApprovedAmount = @RefundAmount,
            DecidedAt = GETDATE()
        WHERE Id = @RequestId;

        -- =========================================
        -- תיעוד החלטת פקיד
        -- =========================================
        INSERT INTO ClerkDecisions
        (RequestId, ClerkId, Decision, ApprovedAmount)
        VALUES
        (@RequestId, @ClerkId, 1, @RefundAmount);

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END