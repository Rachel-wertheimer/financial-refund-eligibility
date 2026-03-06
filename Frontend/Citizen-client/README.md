# Citizen Client - ממשק אזרח

## תיאור כללי

ממשק React לאזרחים לניהול הכנסות, הגשת בקשות החזר וצפייה בהיסטוריה.

## טכנולוגיות

- **React 19** - ספריית UI
- **TypeScript** - טייפ-סקריפט
- **Redux Toolkit** - ניהול state
- **React Router DOM** - ניתוב
- **Axios** - קריאות API
- **Tailwind CSS** - עיצוב

## מבנה הפרויקט

```
Citizen-client/
├── src/
│   ├── api/
│   │   └── citizenApi.ts          # קריאות API לאזרחים
│   │
│   ├── components/
│   │   ├── CitizenDashboard.tsx   # לוח הבקרה הראשי
│   │   ├── IdentityInput.tsx      # הזנת ת"ז
│   │   ├── LastRequestCard.tsx    # תצוגת בקשה אחרונה
│   │   ├── RequestHistory.tsx     # היסטוריית בקשות
│   │   ├── IncomeInputForm.tsx    # טופס הזנת הכנסה
│   │   ├── IncomesView.tsx        # תצוגת הכנסות חודשיות
│   │   ├── CreateRequestButton.tsx # יצירת בקשה חדשה
│   │   ├── LoadingSpinner.tsx     # אינדיקטור טעינה
│   │   └── ErrorMessage.tsx       # הודעות שגיאה
│   │
│   ├── pages/
│   │   ├── HomePage.tsx           # דף בית - התחברות/הרשמה
│   │   └── DashboardPage.tsx      # דף לוח הבקרה
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx          # הגדרת routes
│   │
│   ├── store/
│   │   ├── store.ts               # Redux Store
│   │   └── slices/
│   │       └── citizenSlice.ts    # Redux Slice לאזרחים
│   │
│   ├── hooks/
│   │   ├── useAppDispatch.ts      # Hook ל-dispatch
│   │   ├── useAppSelector.ts      # Hook ל-selector
│   │   └── index.ts               # Export כללי
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript Types
│   │
│   ├── App.tsx                    # רכיב ראשי
│   ├── index.tsx                  # Entry point
│   └── index.css                  # עיצוב גלובלי
│
├── package.json
└── vite.config.ts
```

## Routes

- `/` - דף בית (התחברות/הרשמה)
- `/register` - דף הרשמה
- `/dashboard` - לוח בקרה (מוגן - דורש אזרח מחובר)

## תכונות

### 1. התחברות והרשמה

**דף בית (`/`):**
- הזנת מספר זהות להתחברות
- כפתור "הרשמה" למעבר לדף הרשמה
- אם אזרח לא נמצא - הצעה להרשמה

**דף הרשמה (`/register`):**
- טופס הרשמה עם ת"ז ושם מלא
- אחרי הרשמה מוצלחת - מעבר אוטומטי ללוח הבקרה

### 2. לוח בקרה (`/dashboard`)

לוח הבקרה מחולק ל-3 טאבים:

#### טאב "סקירה כללית"
- **בקשה אחרונה** - תצוגת הבקשה האחרונה עם סטטוס וסכומים
- **היסטוריית בקשות** - טבלה עם כל הבקשות הקודמות

#### טאב "הכנסות"
- **הזנת הכנסה חודשית** - טופס להוספת הכנסה
  - שנת מס
  - חודש
  - סכום
- **תצוגת הכנסות חודשיות** - תצוגה ויזואלית של כל ההכנסות לשנה
  - עדכון אוטומטי אחרי הוספת הכנסה
  - חישוב סה"כ וממוצע חודשי
  - תצוגה לפי חודשים עם צבעים

#### טאב "בקשות"
- **הגשת בקשה חדשה** - טופס ליצירת בקשה
  - שנת מס
  - בדיקה אוטומטית שיש לפחות 6 הכנסות
  - אם אין מספיק הכנסות - הודעה ברורה
- **היסטוריית בקשות** - טבלה עם כל הבקשות

### 3. תכונות נוספות

- **כפתור התנתקות** - ניקוי נתונים וחזרה לדף הבית
- **עדכון אוטומטי** - הכנסות מתעדכנות אוטומטית אחרי הוספה
- **הודעות שגיאה ברורות** - בעברית עם עיצוב בולט
- **Loading States** - אינדיקטורי טעינה
- **עיצוב מודרני** - Dashboard מקצועי עם צבעים נעימים

## API Calls

כל הקריאות ל-API נמצאות ב-`src/api/citizenApi.ts`:

- `getCitizenSummaryByIdentity()` - שליפת נתוני אזרח
- `createCitizen()` - יצירת אזרח חדש
- `getMonthlyIncomes()` - שליפת הכנסות
- `createMonthlyIncome()` - יצירת הכנסה
- `createRefundRequest()` - יצירת בקשה
- `getMonthlyIncomes()` - בדיקת מספר הכנסות (לפני הגשת בקשה)

## State Management

### Redux Store

**citizenSlice:**
- `citizenSummary` - נתוני האזרח המלאים
- `identityNumber` - מספר זהות
- `loading` - מצב טעינה
- `error` - שגיאות

**Actions:**
- `fetchCitizenByIdentity` - שליפת נתוני אזרח
- `clearCitizenData` - ניקוי נתונים (התנתקות)

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

האפליקציה תעלה על `http://localhost:5173` (או פורט אחר).

## Build לייצור

```bash
npm run build
```

הקבצים ייבנו לתיקיית `dist/`.
