# 🚀 Cafe Analytics API Documentation

## Overview
The Cafe Analytics API provides comprehensive data endpoints for the React frontend dashboard. All endpoints return JSON data and are designed to work seamlessly with Recharts visualization components.

## Base URL
```
http://localhost:5000/api
```

## Available Endpoints

### 📊 Dashboard Data

#### `GET /api/dashboard-data`
**Description**: Get basic dashboard metrics for the main overview
**Response**:
```json
{
  "total_revenue": 16640330.0,
  "avg_transaction": 665.59,
  "total_transactions": 25001,
  "revenue_growth": 0.67,
  "peak_hour": 16,
  "items_per_transaction": 3.5,
  "payment_distribution": {
    "Card": 6109,
    "Cash": 6244,
    "Mobile Wallet": 6233,
    "UPI": 6415
  },
  "top_products": {
    "Avocado Toast": 1298,
    "Chocolate Chip Cookies": 1261,
    "Chocolate Fudge Cake": 1214,
    "French Toast": 1200,
    "Omelet": 1204
  }
}
```

#### `GET /api/comprehensive-dashboard`
**Description**: Get all dashboard data in one comprehensive response
**Response**: Complete dashboard data including all KPI categories

### 💰 Financial KPIs

#### `GET /api/kpis/financial`
**Description**: Detailed financial performance metrics
**Response**:
```json
{
  "total_revenue": 16640330.0,
  "avg_transaction_value": 1664.03,
  "total_transactions": 10000,
  "revenue_growth": 0.67,
  "daily_target_achievement": 105.9,
  "current_month_revenue": 1295020.0
}
```

### ⚙️ Operational KPIs

#### `GET /api/kpis/operational`
**Description**: Operational efficiency and performance metrics
**Response**:
```json
{
  "total_transactions": 10000,
  "total_items_sold": 35000,
  "avg_items_per_transaction": 3.5,
  "peak_hour": 16,
  "peak_hour_revenue": 125000.0,
  "busiest_day": "Friday",
  "avg_transaction_duration": 5.2
}
```

### 🛍️ Product KPIs

#### `GET /api/kpis/products`
**Description**: Product performance and analytics
**Response**:
```json
{
  "top_products": [
    {
      "product": "Avocado Toast",
      "quantity_sold": 1298,
      "revenue": 259600.0,
      "transaction_count": 650,
      "avg_price": 200.0,
      "performance_score": 1.0
    }
  ],
  "total_products": 50,
  "cross_sell_rate": 75.5,
  "avg_product_price": 150.0,
  "best_performing_product": "Avocado Toast"
}
```

### 👥 Customer KPIs

#### `GET /api/kpis/customers`
**Description**: Customer behavior and segmentation insights
**Response**:
```json
{
  "total_customers": 10000,
  "avg_customer_value": 1664.03,
  "high_value_customers": 2500,
  "high_value_percentage": 25.0,
  "segment_distribution": {
    "High Value": 2500,
    "Medium Value": 5000,
    "Low Value": 2500
  },
  "payment_distribution": {
    "Card": 6109,
    "Cash": 6244,
    "Mobile Wallet": 6233,
    "UPI": 6415
  }
}
```

### 📈 Trend Analysis

#### `GET /api/trends?period=daily|weekly|monthly`
**Description**: Revenue and transaction trends over time
**Parameters**:
- `period`: `daily` (default), `weekly`, or `monthly`

**Response**:
```json
{
  "trend_data": [
    {
      "date": "2023-01-01",
      "revenue": 50000.0,
      "transactions": 75,
      "items_sold": 300,
      "revenue_growth": 5.2,
      "transaction_growth": 3.1
    }
  ],
  "avg_revenue_growth": 2.5,
  "avg_transaction_growth": 1.8
}
```

### 🕐 Hourly Analysis

#### `GET /api/hourly-analysis`
**Description**: Detailed hourly sales patterns and heatmap data
**Response**:
```json
{
  "hourly_data": [
    {
      "hour": 8,
      "revenue": 15000.0,
      "transactions": 25,
      "quantity": 100,
      "avg_transaction_value": 600.0,
      "avg_items_per_transaction": 4.0
    }
  ],
  "daily_hourly_heatmap": [
    {
      "DayOfWeek": "Monday",
      "Hour": 8,
      "Total Price (INR)": 15000.0
    }
  ],
  "peak_hours": [
    {"hour": 16, "revenue": 25000.0},
    {"hour": 17, "revenue": 23000.0},
    {"hour": 18, "revenue": 22000.0}
  ],
  "busiest_hour": 16,
  "quietest_hour": 2
}
```

### 📊 Revenue Trends

#### `GET /api/revenue-trends?period=daily|weekly|monthly`
**Description**: Revenue trends for chart visualization
**Parameters**:
- `period`: `daily` (default), `weekly`, or `monthly`

**Response**:
```json
[
  {
    "date": "2023-01-01",
    "revenue": 50000.0
  }
]
```

### 🛍️ Product Analytics

#### `GET /api/product-analytics`
**Description**: Comprehensive product performance data
**Response**:
```json
{
  "top_products": [
    {
      "product": "Avocado Toast",
      "quantity_sold": 1298,
      "revenue": 259600.0,
      "transaction_count": 650,
      "avg_price": 200.0,
      "category": "Food"
    }
  ],
  "category_sales": [
    {
      "category": "Food",
      "revenue": 5000000.0
    }
  ],
  "total_products": 50
}
```

### 👥 Customer Insights

#### `GET /api/customer-insights`
**Description**: Customer behavior and transaction patterns
**Response**:
```json
{
  "segment_distribution": {
    "High Value": 2500,
    "Medium Value": 5000,
    "Low Value": 2500
  },
  "payment_preferences": {
    "Card": 6109,
    "Cash": 6244,
    "Mobile Wallet": 6233,
    "UPI": 6415
  },
  "avg_transaction_value": 1664.03,
  "avg_items_per_transaction": 3.5,
  "total_customers": 10000
}
```

### 📋 Sales Summary

#### `GET /api/sales-summary?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
**Description**: Sales summary for specific date range
**Parameters**:
- `start_date`: Start date (optional)
- `end_date`: End date (optional)

**Response**:
```json
{
  "total_revenue": 1000000.0,
  "total_transactions": 500,
  "total_items_sold": 2000,
  "avg_transaction_value": 2000.0,
  "top_items": {
    "Avocado Toast": 100,
    "Coffee": 150
  },
  "revenue_by_payment": {
    "Card": 400000.0,
    "Cash": 600000.0
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `500`: Server error

Error responses include:
```json
{
  "error": "Error message description"
}
```

## CORS Configuration

The API is configured to accept requests from `http://localhost:3000` (React development server).

## Data Processing

The API uses a comprehensive analytics utility (`CafeAnalytics`) that:
- Preprocesses transaction data
- Calculates various KPIs
- Handles date/time analysis
- Provides trend calculations
- Manages customer segmentation

## Usage Examples

### React Frontend Integration

```javascript
// Fetch dashboard data
const response = await fetch('http://localhost:5000/api/comprehensive-dashboard');
const data = await response.json();

// Use financial KPIs
const financialData = data.financial_kpis;
console.log('Total Revenue:', financialData.total_revenue);

// Use trend data for charts
const trendData = data.trend_analysis.trend_data;
// Perfect for Recharts LineChart component
```

### Date Range Filtering

```javascript
// Get sales summary for specific period
const startDate = '2023-01-01';
const endDate = '2023-12-31';
const response = await fetch(
  `http://localhost:5000/api/sales-summary?start_date=${startDate}&end_date=${endDate}`
);
```

This API provides all the data needed for a comprehensive React dashboard with Recharts visualizations!




