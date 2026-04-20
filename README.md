# 💰 Personal Finance & Expense Analytics App

A modern **React-based Personal Finance Tracker** that helps students and young professionals manage income, monitor expenses, track budgets, and visualize spending behavior using analytics dashboards.

This project simulates a **real-world consumer finance application** with transaction tracking, filtering, recurring expenses, and interactive charts.

---

# 🚀 Features

## 📊 Dashboard

* View total income
* View total expenses
* Check net balance
* Identify top spending category
* Quick financial summary cards

---

## 💸 Transactions Management

Users can:

* Add transactions
* Edit transactions
* Delete transactions
* Categorize expenses
* Add notes
* Mark recurring expenses

Supported transaction types:

* Income
* Expense

---

## 🔍 Search & Filters

Dynamic filtering options:

* Search by title
* Search by notes
* Filter by category
* Filter by transaction type
* Filter by date range

Sorting options:

* Date
* Amount
* Category

---

## 📅 Budget Tracking

Set a monthly budget and monitor:

* Total spending
* Remaining balance
* Percentage of budget used

---

## 📈 Analytics Dashboard

Visual financial insights using charts:

* Spending by category (Pie Chart)
* Monthly spending trend (Line Chart)
* Income vs Expense comparison (Bar Chart)

---

## 🔁 Recurring Expense Tracking

Track repeated expenses such as:

* Rent
* Netflix
* Gym
* Subscriptions

Recurring transactions are highlighted automatically.

---

# 🧠 Tech Stack

### Frontend

* React
* React Router DOM
* Context API
* Custom Hooks

### Libraries Used

* react-router-dom
* axios
* react-icons
* react-toastify
* react-hook-form
* yup
* recharts
* date-fns
* uuid
* framer-motion

---

# 📂 Folder Structure

```
src

components
   TransactionCard
   Charts
   SearchBar
   Filters
   BudgetCard

pages
   Dashboard
   Transactions
   AddTransaction
   Budget
   Analytics

context
   FinanceContext

hooks
   useTransactions
   useBudget
   useDebounce

services
   api.js

utils
   currencyFormatter.js
```

---

# 🛠 Installation & Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the repository

```
git clone <your-repository-link>
```

### 2️⃣ Navigate to project folder

```
cd project-folder
```

### 3️⃣ Install dependencies

```
npm install
```

### 4️⃣ Start development server

```
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

# 🌐 Routing Structure

| Page            | Route             |
| --------------- | ----------------- |
| Dashboard       | /dashboard        |
| Transactions    | /transactions     |
| Add Transaction | /transactions/new |
| Budget          | /budget           |
| Analytics       | /analytics        |

---

# 🔌 Optional API Integrations

### Currency Exchange API

Used for currency conversion support:

```
https://api.exchangerate-api.com
```

### Financial News API (Optional)

Display financial headlines inside dashboard:

```
https://newsapi.org
```

---

# 🧱 Data Models

### Transaction Object

```
{
 id: string,
 title: string,
 amount: number,
 category: string,
 type: "income" | "expense",
 date: date,
 notes: string,
 recurring: boolean
}
```

### Budget Object

```
{
 monthlyBudget: number
}
```

---

# ⚙️ Core React Concepts Used

This project demonstrates:

* useState
* useEffect
* Context API
* Custom Hooks
* React Router DOM
* Form validation with react-hook-form + yup
* Chart rendering with Recharts

---

# 🎯 Target Users

Designed for:

* Students
* Early-career professionals
* Freelancers managing income streams

Helps users:

* Understand spending habits
* Monitor subscriptions
* Control monthly expenses
* Improve financial awareness

---

# 📱 Non‑Functional Features

* Responsive UI
* Fast load states
* Empty state handling
* Scalable architecture


# 👩‍💻 Author

**Eshika Kar**

React Developer | Web App Builder | Data‑Driven UI Enthusiast

---

# ⭐ Future Improvements

Possible upgrades:

* Firebase authentication
* Cloud sync support
* Export reports (PDF/CSV)
* Dark mode
* AI‑based spending insights

---

# 📜 License

This project is developed for academic purposes under the **Building Web Applications with React** end‑term submission. Based on project requirements described in the PRD. fileciteturn0file0
