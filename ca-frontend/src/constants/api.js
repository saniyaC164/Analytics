// API configuration and endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    DASHBOARD_DATA: '/dashboard-data',
    COMPREHENSIVE_DASHBOARD: '/comprehensive-dashboard',
    FINANCIAL_KPIS: '/kpis/financial',
    OPERATIONAL_KPIS: '/kpis/operational',
    PRODUCT_KPIS: '/kpis/products',
    CUSTOMER_KPIS: '/kpis/customers',
    TRENDS: '/trends',
    HOURLY_ANALYSIS: '/hourly-analysis',
    REVENUE_TRENDS: '/revenue-trends',
    PRODUCT_ANALYTICS: '/product-analytics',
    CUSTOMER_INSIGHTS: '/customer-insights',
    SALES_SUMMARY: '/sales-summary'
};

export const CHART_COLORS = {
    PRIMARY: '#1976d2',
    SECONDARY: '#dc004e',
    SUCCESS: '#2e7d32',
    WARNING: '#ed6c02',
    ERROR: '#d32f2f',
    INFO: '#0288d1',
    GRADIENT: ['#1976d2', '#42a5f5', '#90caf9', '#bbdefb']
};
