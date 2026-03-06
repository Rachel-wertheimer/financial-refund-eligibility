# Clerk Client - ממשק פקיד

## תיאור כללי

ממשק React לפקידים לניהול בקשות החזר, ביצוע חישובים ואישור/דחיית בקשות.

## טכנולוגיות

- **React 19** - ספריית UI
- **TypeScript** - טייפ-סקריפט
- **Redux Toolkit** - ניהול state
- **React Router DOM** - ניתוב
- **Axios** - קריאות API עם JWT Interceptors
- **Tailwind CSS** - עיצוב
- **jwt-decode** - פענוח JWT tokens

## מבנה הפרויקט

```
Clerk-client/
├── src/
│   ├── api/
│   │   └── clerkApi.ts            # קריאות API לפקידים
│   │
│   ├── components/
│   │   ├── ClerkDashboard.tsx    # לוח הבקרה הראשי
│   │   ├── LoginForm.tsx         # טופס התחברות
│   │   ├── PendingRequestsList.tsx # רשימת בקשות ממתינות
│   │   ├── RequestDetailsView.tsx  # פרטי בקשה בודדת
│   │   ├── BudgetDisplay.tsx     # תצוגת תקציב
│   │   ├── CreateRequestForm.tsx # יצירת בקשה חדשה (3 שלבים)
│   │   ├── CitizenLookup.tsx     # חיפוש אזרח לפי ת"ז
│   │   ├── CitizenHistoryView.tsx # תצוגת היסטוריית אזרח
│   │   ├── IncomeByYearDisplay.tsx
│   │   ├── PastRequestsDisplay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx         # דף התחברות
│   │   └── DashboardPage.tsx    # דף לוח הבקרה (מוגן)
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx         # הגדרת routes
│   │
│   ├── store/
│   │   ├── store.ts              # Redux Store
│   │   └── slices/
│   │       └── clerkSlice.ts     # Redux Slice לפקידים
│   │
│   ├── hooks/
│   │   ├── useAppDispatch.ts
│   │   ├── useAppSelector.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── index.ts              # Types כללי
│   │   └── auth.ts               # Types לאימות
│   │
│   ├── utils/
│   │   └── jwt.ts                # פונקציות JWT
│   │
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
│
├── package.json
└── vite.config.ts
```

## Routes

- `/login` - דף התחברות
- `/dashboard` - לוח בקרה (מוגן - דורש JWT Token)
- `/` - הפניה אוטומטית ל-`/dashboard`

## תכונות

### 1. התחברות

**דף התחברות (`/login`):**
- טופס עם username ו-password
- שמירת JWT Token ב-localStorage
- מעבר אוטומטי ללוח הבקרה אחרי התחברות מוצלחת
- אם לא מחובר - הפניה אוטומטית לדף התחברות

### 2. לוח בקרה (`/dashboard`)

#### תצוגת תקציב
- תקציב כולל, משומש וזמין
- Progress bar ויזואלי
- עדכון אוטומטי אחרי החלטות

#### רשימת בקשות ממתינות
- רשימת כל הבקשות במצב Pending/Calculated
- מידע על כל בקשה:
  - שם האזרח
  - מספר זהות
  - שנת מס
  - תאריך יצירה
- לחיצה על בקשה - מעבר לפרטים

#### פרטי בקשה
- **פרטי הבקשה** - סטטוס, סכומים
- **פרטי האזרח** - שם, ת"ז
- **הכנסות לפי שנים** - תצוגה מאורגנת
- **בקשות עבר** - היסטוריה של האזרח
- **כפתורי פעולה**:
  - "אשר" - חישוב ואישור
  - "דחה" - חישוב ודחייה

### 3. תכונות נוספות

#### הגשת בקשה חדשה
טופס רב-שלבי:
1. **שלב 1: יצירת אזרח**
   - מספר זהות
   - שם מלא
2. **שלב 2: הוספת הכנסות**
   - הוספת הכנסות חודשיות
   - אפשרות להוסיף מספר הכנסות
3. **שלב 3: יצירת בקשה**
   - שנת מס
   - יצירת הבקשה

#### חיפוש אזרח
- חיפוש לפי מספר זהות
- תצוגת היסטוריה מלאה של האזרח
- בקשה אחרונה וכל ההיסטוריה

#### כפתור התנתקות
- ניקוי JWT Token
- מעבר לדף התחברות

## API Calls

כל הקריאות ל-API נמצאות ב-`src/api/clerkApi.ts`:

### Authentication
- `login()` - התחברות וקבלת JWT Token
- `logout()` - ניקוי Token
- `isAuthenticated()` - בדיקת מצב התחברות

### Refund Requests
- `getPendingRequests()` - רשימת בקשות ממתינות 🔒
- `getRequestDetails()` - פרטי בקשה 🔒
- `calculateRefund()` - חישוב ואישור/דחייה 🔒

### Budget
- `getMonthlyBudget()` - תקציב חודשי 🔒

### Citizens (לפקיד)
- `getCitizenSummaryByIdentity()` - חיפוש אזרח 🔒
- `createCitizen()` - יצירת אזרח חדש 🔒
- `createMonthlyIncome()` - הוספת הכנסה 🔒
- `createRefundRequest()` - יצירת בקשה 🔒

🔒 = דורש JWT Token

## Authentication Flow

1. **התחברות**: POST `/api/Auth/login` → קבלת JWT Token
2. **שמירה**: Token נשמר ב-`localStorage`
3. **שימוש**: Axios Interceptor מוסיף את ה-Token לכל בקשה
4. **בדיקה**: אם Token לא תקין (401) → ניקוי ומעבר ל-login
5. **פענוח**: `jwt-decode` לחילוץ `ClerkId` מה-Token

## State Management

### Redux Store

**clerkSlice:**
- `pendingRequests` - רשימת בקשות ממתינות
- `selectedRequestId` - ID של הבקשה הנבחרת
- `selectedRequestDetails` - פרטי הבקשה הנבחרת
- `currentBudget` - תקציב חודשי נוכחי
- `loading` - מצב טעינה
- `error` - שגיאות

**Actions:**
- `fetchPendingRequests` - שליפת בקשות ממתינות
- `fetchRequestDetails` - שליפת פרטי בקשה
- `calculateRefundRequest` - חישוב ואישור/דחייה
- `fetchMonthlyBudget` - שליפת תקציב
- `setSelectedRequestId` - בחירת בקשה
- `clearSelectedRequest` - ניקוי בחירה

## עיצוב

המערכת משתמשת ב-Tailwind CSS עם עיצוב מודרני:

- **צבעים עיקריים**: כחול כהה (#0f2a44), לבן, אפור בהיר (#f5f7fa)
- **Components**: `.btn-primary`, `.btn-secondary`, `.card`, `.input-field`, `.label`
- **טיפוגרפיה**: Inter/Segoe UI
- **RTL Support**: תמיכה מלאה בעברית מימין לשמאל

## הרצה

```bash
npm install
npm run dev
```

האפליקציה תעלה על `http://localhost:5174` (או פורט אחר).

## Build לייצור

```bash
npm run build
```

הקבצים ייבנו לתיקיית `dist/`.

## הערות חשובות

1. **JWT Token**: נשמר ב-localStorage. בייצור, שקול שימוש ב-httpOnly cookies
2. **Token Expiration**: ה-Token תקף ל-60 דקות (ניתן לשנות ב-Backend)
3. **Auto-refresh**: אם Token פג תוקף, המשתמש יועבר אוטומטית ל-login
4. **ClerkId**: מחולץ מה-Token אוטומטית לשימוש בבקשות
