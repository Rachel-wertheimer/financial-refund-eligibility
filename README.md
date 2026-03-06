# מערכת החזר כספי - Financial Eligibility System

## תיאור כללי

מערכת לחישוב זכאות להחזר כספי עבור אזרחים. המערכת מחשבת החזר כספי על בסיס נתוני הכנסה חודשיים של האזרחים ועל בסיס בקשות להחזר שנתיות.

### תכונות עיקריות

- **הזנת הכנסות חודשיות** - אזרחים יכולים להזין את הכנסותיהם החודשיות
- **הגשת בקשות החזר** - אזרחים יכולים להגיש בקשה להחזר כספי אחת לשנה
- **חישוב אוטומטי** - המערכת מחשבת את סכום הזכאות בהתאם לכללים עסקיים מוגדרים
- **ניהול תקציב** - המערכת פועלת תחת מגבלת תקציב חודשית
- **ממשק פקיד** - פקידים יכולים לטפל בבקשות, לבצע חישובים ולאשר/לדחות בקשות

### טכנולוגיות

- **Backend**: .NET Core 8.0, Entity Framework Core, SQL Server
- **Frontend**: React 19, TypeScript, Redux Toolkit, Tailwind CSS
- **Database**: SQL Server עם Stored Procedures לחישובים מורכבים
- **Authentication**: JWT עבור פקידים

---

## התקנה והרצה

### דרישות מוקדמות

- .NET 8.0 SDK
- SQL Server (Express או גרסה מלאה)
- Node.js 18+ ו-npm
- Visual Studio 2022 או VS Code (אופציונלי)

### שלב 1: הורדת הפרויקט

```bash
git clone https://github.com/Rachel-wertheimer/financial-refund-eligibility.git
cd FinancialEligibilityTask
```

### שלב 2: הגדרת מסד הנתונים


1. פתח את `Backend/Web API/Web API/appsettings.json`
2. עדכן את Connection String:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RefundSystem;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```
#### אפשרות א': שימוש ב-Migrations (מומלץ)

3. פתח Terminal בתיקיית `Backend/Web API/Data`
4. הרץ את הפקודות הבאות:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### אפשרות ב': הרצת SQL Scripts ידנית

1. פתח את SQL Server Management Studio
2. צור מסד נתונים חדש בשם `RefundSystemDb`
3. הרץ את ה-Scripts הבאים בסדר:
   - `Backend/SQL/InitialCreateDB`
### שלב 3: הרצת פורצדורות

    1. פתח את SQL Server Management Studio
    2. צור מסד נתונים חדש בשם `RefundSystemDb`
    3. הרץ את ה-Scripts הבאים בסדר:

   - `Backend/SQL/CalculateRefund.sql` - Stored Procedure לחישוב החזר
   - `Backend/SQL/ApproveRefund.sql` - Stored Procedure לאישור החזר

### שלב 4: הרצת Backend

1. פתח Terminal בתיקיית `Backend/Web API/Web API`
2. הרץ:
```bash
dotnet restore
dotnet run
```

השרת יעלה על `https://localhost:44384` (או `http://localhost:5133`)

### שלב 5: הרצת Frontend

#### Citizen-client (ממשק אזרח)

1. פתח Terminal בתיקיית `Frontend/Citizen-client`
2. הרץ:
```bash
npm install
npm run dev
```

האפליקציה תעלה על `http://localhost:5173` (או פורט אחר)

#### Clerk-client (ממשק פקיד)

1. פתח Terminal נוסף בתיקיית `Frontend/Clerk-client`
2. הרץ:
```bash
npm install
npm run dev
```

האפליקציה תעלה על `http://localhost:5174` (או פורט אחר)
עליך ליצור בכל אחד משני הפרויקטים קובץ .env בשורש התיקייה.
– בתוך הקובץ הזה צריך להגדיר את המשתנה הבא:
```bash
REACT_APP_API_BASE_URL=https://localhost:44384/ -- עליך להכניס את הפורט של צד הBACK
```
---

## מבנה הפרויקט

```
FinancialEligibilityTask/
├── Backend/
│   ├── Web API/          # .NET Core Web API
│   │   ├── Core/         # Entities, DTOs, Interfaces, Mapping
│   │   ├── Data/         # DbContext, Repositories, Migrations
│   │   ├── Service/      # Business Logic Services
│   │   └── Web API/      # Controllers, Program.cs
│   ├── SQL/              # SQL Scripts (אם קיימים)
│   ├── CalculateRefund.sql
│   ├── ApproveRefund.sql
│   └── CreateClerk.sql
│
├── Frontend/
│   ├── Citizen-client/   # React App לאזרחים
│   └── Clerk-client/     # React App לפקידים
│
└── README.md            # קובץ זה
```

---

## כללי עסקיים

### חישוב החזר כספי

החישוב מתבצע באופן מדורג לפי ממוצע ההכנסות בשנה האחרונה:

- **עד 5,000 ש"ח** - החזר בשיעור 15%
- **בין 5,000 ל-8,000 ש"ח** - החזר בשיעור 10%
- **בין 8,000 ל-9,000 ש"ח** - החזר בשיעור 5%
- **מעל 9,000 ש"ח** - אין החזר

החישוב הוא מצטבר לפי מדרגות (לא לפי שיעור יחיד).

### דרישות להגשת בקשה

- לפחות 6 הכנסות חודשיות לשנת המס
- אין בקשה מאושרת קיימת לאותה שנה
- אין בקשה פתוחה (Pending/Calculated) לאותה שנה

### תקציב חודשי

- המערכת פועלת תחת מגבלת תקציב חודשית
- התקציב מתעדכן אוטומטית בהתאם להחלטות הפקיד
- המערכת מונעת הקצאת תקציב כפולה במקרה של בקשות מקבילות

---

## בעקבות שאין מערכת לניהול הפקידים והתקציבים עליך

לאחר יצירת מסד הנתונים,:

### ליצור פקיד ראשוני
1. הרץ את צד הBACK והרץ את הENTRYPOINT הבאה
```bash
POST https://localhost:44384/api/clerks/create
{
  "username": "הכנס שם של USER",
  "password": "הכנס סיסמה לבחירתך"
}
```
### להגדיר תקציבים  

    1. פתח את SQL Server Management Studio
    2. צור רשומה חדשה בטבלת `MonthlyBudgets`
    3. הרץ את ה-Scripts הבאים בסדר:

   - `Backend/SQL/MonthlyBudgets.sql` - Script  להכנסת נתונים של תקציב לחודש


---

## תיעוד נוסף

- [Backend README](./Backend/README.md) - תיעוד מפורט על ה-API
- [Citizen-client README](./Frontend/Citizen-client/README.md) - תיעוד על ממשק האזרח
- [Clerk-client README](./Frontend/Clerk-client/README.md) - תיעוד על ממשק הפקיד

---

## הערות חשובות

- **CORS**: ה-Backend מוגדר לאפשר כל Origin (לצורך פיתוח). בייצור יש להגביל.
- **HTTPS**: ה-Backend רץ על HTTPS. אם יש בעיות עם Certificate, אפשר להשתמש ב-HTTP בפיתוח.
- **Database**: ודא ש-SQL Server רץ וזמין לפני הרצת ה-Backend.

---

## תמיכה

לשאלות או בעיות, אנא פנה למפתח הפרויקט במייל: rachel.fsd108@gmail.com
