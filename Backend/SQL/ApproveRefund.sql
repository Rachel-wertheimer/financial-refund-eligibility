CREATE OR ALTER PROCEDURE ApproveRefund
    @RequestId INT,
    @ApprovedAmount DECIMAL(18,2),
    @ClerkId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    DECLARE @Year INT
    DECLARE @Month INT = MONTH(GETDATE())

    SELECT @Year = YEAR(GETDATE())

    DECLARE @Available DECIMAL(18,2)

    SELECT @Available = TotalBudget - UsedBudget
    FROM MonthlyBudgets WITH (UPDLOCK, ROWLOCK)
    WHERE Year = @Year AND Month = @Month

    IF @Available < @ApprovedAmount
    BEGIN
        ROLLBACK
        RAISERROR('Insufficient budget',16,1)
        RETURN
    END

    UPDATE MonthlyBudgets
    SET UsedBudget = UsedBudget + @ApprovedAmount
    WHERE Year = @Year AND Month = @Month

    UPDATE RefundRequests
    SET Status = 2,
        ApprovedAmount = @ApprovedAmount,
        DecidedAt = GETDATE()
    WHERE Id = @RequestId

    INSERT INTO ClerkDecisions(RequestId, ClerkId, Decision, ApprovedAmount)
    VALUES(@RequestId, @ClerkId, 1, @ApprovedAmount)

    COMMIT
END