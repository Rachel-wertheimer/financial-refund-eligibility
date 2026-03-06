# Backend API - מערכת החזר כספי

## תיאור כללי

Backend API מבוסס .NET Core 8.0 המספק endpoints לניהול אזרחים, הכנסות, בקשות החזר, תקציבים ופקידים.

## טכנולוגיות

- **.NET Core 8.0**
- **Entity Framework Core** - ORM למסד הנתונים
- **SQL Server** - מסד הנתונים
- **Stored Procedures** - לחישובים מורכבים
- **AutoMapper** - מיפוי בין Entities ל-DTOs
- **JWT Authentication** - אימות פקידים
- **BCrypt** - הצפנת סיסמאות

## מבנה הפרויקט

```
Backend/Web API/
├── Core/
│   ├── Entities/          # מודלים של מסד הנתונים
│   ├── DTOs/              # Data Transfer Objects
│   ├── Interfaces/        # ממשקים
│   ├── Enums/             # Enumerations
│   └── Mapping/           # AutoMapper Profiles
│
├── Data/
│   ├── Repositories/      # Repository Pattern
│   ├── Migrations/         # EF Core Migrations
│   └── RefundDbContext.cs # DbContext
│
├── Service/
│   └── Service/         # Business Logic Services
│
└── Web API/
    ├── Controllers/        # API Controllers
    ├── Program.cs         # Startup Configuration
    └── appsettings.json   # Configuration
```

## API Endpoints

### 1. Authentication (`/api/Auth`)

#### POST `/api/Auth/login`
התחברות פקיד - החזרת JWT Token

**Request Body:**
```json
{
  "username": "רחל ורטהימר",
  "password": "ר214ו"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2026-03-06T22:39:53Z"
}
```

**Errors:**
- `400` - Bad Request (נתונים חסרים)
- `401` - Unauthorized (שם משתמש או סיסמה לא נכונים)
- `500` - Internal Server Error

---

### 2. Citizens (`/api/Citizens`)

#### POST `/api/Citizens`
יצירת אזרח חדש (הרשמה)

**Request Body:**
```json
{
  "identityNumber": "123456789",
  "fullName": "ישראל ישראלי"
}
```

**Response (200 OK):**
```json
{
  "citizenId": 1,
  "identityNumber": "123456789",
  "fullName": "ישראל ישראלי"
}
```

**Errors:**
- `400` - Bad Request (נתונים לא תקינים)
- `409` - Conflict (אזרח עם ת"ז זה כבר קיים)
- `500` - Internal Server Error

#### GET `/api/Citizens/by-identity/{identityNumber}`
שליפת נתוני אזרח לפי מספר זהות (כולל בקשה אחרונה והיסטוריה)

**Response (200 OK):**
```json
{
  "citizen": {
    "citizenId": 1,
    "identityNumber": "123456789",
    "fullName": "ישראל ישראלי"
  },
  "lastRequest": {
    "id": 1,
    "taxYear": 2025,
    "status": 2,
    "calculatedAmount": 1500.00,
    "approvedAmount": 1500.00
  },
  "history": [
    {
      "id": 1,
      "taxYear": 2025,
      "status": "Approved",
      "approvedAmount": 1500.00
    }
  ]
}
```

**Errors:**
- `400` - Bad Request (ת"ז לא תקין)
- `404` - Not Found (אזרח לא נמצא)
- `500` - Internal Server Error

---

### 3. Incomes (`/api/Incomes`)

#### POST `/api/Incomes`
הוספת הכנסה חודשית

**Request Body:**
```json
{
  "citizenId": 1,
  "taxYear": 2025,
  "month": 1,
  "amount": 5000.00
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "citizenId": 1,
  "taxYear": 2025,
  "month": 1,
  "amount": 5000.00
}
```

**Errors:**
- `400` - Bad Request (נתונים לא תקינים)
- `409` - Conflict (הכנסה לחודש זה כבר קיימת)
- `500` - Internal Server Error

#### GET `/api/Incomes/{citizenId}/{taxYear}`
שליפת הכנסות לפי אזרח ושנת מס

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "citizenId": 1,
    "taxYear": 2025,
    "month": 1,
    "amount": 5000.00
  },
  {
    "id": 2,
    "citizenId": 1,
    "taxYear": 2025,
    "month": 2,
    "amount": 6000.00
  }
]
```

**Errors:**
- `400` - Bad Request (citizenId או taxYear לא תקינים)
- `500` - Internal Server Error

---

### 4. RefundRequests (`/api/RefundRequests`)

#### POST `/api/RefundRequests`
יצירת בקשה להחזר כספי

**Request Body:**
```json
{
  "citizenId": 1,
  "taxYear": 2025
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "taxYear": 2025,
  "status": 0,
  "calculatedAmount": null,
  "approvedAmount": null
}
```

**Errors:**
- `400` - Bad Request (נתונים לא תקינים או אזרח לא קיים)
- `409` - Conflict (קיימת כבר בקשה לשנת מס זו)
- `500` - Internal Server Error

#### POST `/api/RefundRequests/{id}/calculate` 🔒
חישוב החזר כספי (דורש הרשאות Clerk)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Request Body:**
```json
{
  "clerkId": 1,
  "approve": true
}
```

**Response (200 OK):**
```json
{
  "message": "Refund calculation completed successfully."
}
```

**Errors:**
- `400` - Bad Request (נתונים לא תקינים)
- `401` - Unauthorized (לא מחובר או אין הרשאות)
- `500` - Internal Server Error

#### GET `/api/RefundRequests/pending` 🔒
רשימת בקשות ממתינות (דורש הרשאות Clerk)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "taxYear": 2025,
    "status": "Pending",
    "createdAt": "2026-03-05T22:00:00Z",
    "citizenId": 1,
    "citizenFullName": "ישראל ישראלי",
    "citizenIdentityNumber": "123456789"
  }
]
```

**Errors:**
- `401` - Unauthorized
- `500` - Internal Server Error

#### GET `/api/RefundRequests/{id}/details` 🔒
פרטי בקשה בודדת (דורש הרשאות Clerk)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
{
  "request": {
    "id": 1,
    "taxYear": 2025,
    "status": 0,
    "calculatedAmount": null,
    "approvedAmount": null
  },
  "citizen": {
    "citizenId": 1,
    "identityNumber": "123456789",
    "fullName": "ישראל ישראלי"
  },
  "incomesByYear": [
    {
      "taxYear": 2025,
      "monthlyIncomes": [
        {
          "month": 1,
          "amount": 5000.00
        }
      ]
    }
  ],
  "pastRequests": [
    {
      "id": 2,
      "taxYear": 2024,
      "status": "Approved",
      "approvedAmount": 1200.00
    }
  ]
}
```

**Errors:**
- `400` - Bad Request (מספר בקשה לא תקין)
- `401` - Unauthorized
- `404` - Not Found (בקשה לא נמצאה)
- `500` - Internal Server Error

---

### 5. Budget (`/api/Budget`)

#### GET `/api/Budget/{year}/{month}` 🔒
שליפת תקציב חודשי (דורש הרשאות Clerk)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
{
  "year": 2025,
  "month": 3,
  "totalBudget": 100000.00,
  "usedBudget": 25000.00,
  "availableBudget": 75000.00
}
```

**Errors:**
- `400` - Bad Request (חודש לא תקין)
- `401` - Unauthorized
- `404` - Not Found (תקציב לא נמצא)
- `500` - Internal Server Error

---

### 6. Clerks (`/api/Clerks`)

#### POST `/api/Clerks/create`
יצירת פקיד חדש (לבדיקות בלבד - יש להסיר בייצור)

**Request Body:**
```json
{
  "username": "רחל ורטהימר",
  "password": "ר214ו"
}
```

**Response (200 OK):**
```json
{
  "message": "Clerk created successfully.",
  "clerkId": 1
}
```

**Errors:**
- `400` - Bad Request
- `409` - Conflict (פקיד עם שם משתמש זה כבר קיים)
- `500` - Internal Server Error

---

## Stored Procedures

### CalculateRefund
מבצע חישוב החזר כספי עם כל הבדיקות והכללים העסקיים.

**Parameters:**
- `@RequestId` (int) - מספר הבקשה
- `@ClerkId` (int) - מספר הפקיד
- `@Approve` (bit) - האם לאשר את הבקשה

**תהליך:**
1. בדיקה שיש לפחות 6 הכנסות חודשיות
2. בדיקה שאין בקשה מאושרת קיימת
3. חישוב ממוצע הכנסות
4. חישוב החזר מדורג
5. עדכון תקציב (אם מאושר)
6. עדכון סטטוס הבקשה

### ApproveRefund
מבצע אישור/דחייה של בקשה עם עדכון תקציב.

---

## DTOs (Data Transfer Objects)

### Citizens
- `CreateCitizenDto` - יצירת אזרח חדש
- `CitizenDto` - נתוני אזרח
- `CitizenSummaryDto` - סיכום אזרח (כולל בקשה אחרונה והיסטוריה)

### Incomes
- `CreateMonthlyIncomeDto` - יצירת הכנסה חודשית
- `MonthlyIncomeDto` - נתוני הכנסה

### RefundRequests
- `CreateRefundRequestDto` - יצירת בקשה
- `RefundRequestDto` - נתוני בקשה
- `RefundRequestListItemDto` - פריט ברשימת בקשות
- `RefundRequestDetailsDto` - פרטי בקשה מלאים
- `CalculateRequestDto` - בקשת חישוב

### Budgets
- `MonthlyBudgetDto` - תקציב חודשי

### Auth
- `LoginRequestDto` - בקשת התחברות
- `LoginResponseDto` - תגובת התחברות (JWT Token)

---

## Authentication

המערכת משתמשת ב-JWT Authentication עבור פקידים.

### קבלת Token:
1. POST `/api/Auth/login` עם username ו-password
2. קבלת JWT Token בתגובה
3. שימוש ב-Token בכל בקשה מוגנת: `Authorization: Bearer {TOKEN}`

### Endpoints מוגנים:
כל ה-endpoints המסומנים ב-🔒 דורשים JWT Token תקין עם Role "Clerk".

---

## Database Schema

### טבלאות עיקריות:
- **Citizens** - אזרחים
- **MonthlyIncomes** - הכנסות חודשיות
- **RefundRequests** - בקשות החזר
- **MonthlyBudgets** - תקציבים חודשיים
- **Clerks** - פקידים
- **ClerkDecisions** - החלטות פקידים

---

## Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RefundSystem;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSecretKeyHere_MustBeAtLeast32Characters",
    "Issuer": "RefundSystem",
    "Audience": "RefundSystemClients",
    "ExpiresMinutes": 60
  }
}
```

---

## הערות חשובות

1. **Stored Procedures**: החישובים המרכזיים מתבצעים ב-Stored Procedures למניעת race conditions
2. **Concurrency**: שימוש ב-RowVersion (Optimistic Concurrency) למניעת הקצאת תקציב כפולה
3. **Error Handling**: כל ה-Controllers כוללים טיפול מקיף בשגיאות
4. **Logging**: שימוש ב-ILogger לכל פעולות חשובות
