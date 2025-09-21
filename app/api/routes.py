from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from config import Config
from app.utils.analytics import CafeAnalytics
import json

# Define the API Blueprint
api = Blueprint('api', __name__, url_prefix='/api')

def load_data():
    """Load and preprocess the cafe transaction data"""
    try:
        df = pd.read_csv(Config.CAFE_DATA)
        df['Date'] = pd.to_datetime(df['Date'])
        df['Time'] = pd.to_datetime(df['Time'], format='%H:%M:%S').dt.time
        df['DateTime'] = pd.to_datetime(df['Date'].astype(str) + ' ' + df['Time'].astype(str))
        df['Hour'] = df['DateTime'].dt.hour
        df['DayOfWeek'] = df['DateTime'].dt.day_name()
        df['Month'] = df['DateTime'].dt.month_name()
        df['Revenue'] = df['Quantity'] * df['Total Price (INR)']
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

@api.route('/dashboard-data')
def get_dashboard_data():
    """Get comprehensive dashboard metrics"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        # Basic metrics
        total_revenue = float(df['Total Price (INR)'].sum())
        avg_transaction = float(df['Total Price (INR)'].mean())
        total_transactions = int(len(df))
        
        # Calculate growth metrics
        current_month = df[df['DateTime'].dt.month == df['DateTime'].dt.month.max()]
        previous_month = df[df['DateTime'].dt.month == df['DateTime'].dt.month.max() - 1]
        
        current_revenue = float(current_month['Total Price (INR)'].sum())
        previous_revenue = float(previous_month['Total Price (INR)'].sum())
        revenue_growth = float(((current_revenue - previous_revenue) / previous_revenue * 100) if previous_revenue > 0 else 0)
        
        # Peak hours analysis
        hourly_sales = df.groupby('Hour')['Total Price (INR)'].sum().reset_index()
        peak_hour = int(hourly_sales.loc[hourly_sales['Total Price (INR)'].idxmax(), 'Hour'])
        
        # Average items per transaction
        items_per_transaction = float(df.groupby('Transaction ID')['Quantity'].sum().mean())
        
        # Payment method distribution
        payment_distribution = df['Payment Method'].value_counts().to_dict()
        
        # Top products
        top_products = df.groupby('Item')['Quantity'].sum().sort_values(ascending=False).head(5).to_dict()
        
        return jsonify({
            'total_revenue': round(float(total_revenue), 2),
            'avg_transaction': round(float(avg_transaction), 2),
            'total_transactions': int(total_transactions),
            'revenue_growth': round(float(revenue_growth), 2),
            'peak_hour': int(peak_hour),
            'items_per_transaction': round(float(items_per_transaction), 2),
            'payment_distribution': payment_distribution,
            'top_products': top_products
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/revenue-trends')
def get_revenue_trends():
    """Get revenue trends data for charts"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        period = request.args.get('period', 'daily')  # daily, weekly, monthly
        
        if period == 'daily':
            revenue_data = df.groupby(df['Date'].dt.date)['Total Price (INR)'].sum().reset_index()
            revenue_data.columns = ['date', 'revenue']
        elif period == 'weekly':
            revenue_data = df.groupby(df['Date'].dt.to_period('W'))['Total Price (INR)'].sum().reset_index()
            revenue_data['date'] = revenue_data['Date'].dt.start_time.dt.date
            revenue_data = revenue_data[['date', 'Total Price (INR)']]
            revenue_data.columns = ['date', 'revenue']
        elif period == 'monthly':
            revenue_data = df.groupby(df['Date'].dt.to_period('M'))['Total Price (INR)'].sum().reset_index()
            revenue_data['date'] = revenue_data['Date'].dt.start_time.dt.date
            revenue_data = revenue_data[['date', 'Total Price (INR)']]
            revenue_data.columns = ['date', 'revenue']
        
        # Convert to string for JSON serialization
        revenue_data['date'] = revenue_data['date'].astype(str)
        
        return jsonify(revenue_data.to_dict('records'))
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/product-analytics')
def get_product_analytics():
    """Get product performance analytics"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        # Top selling products
        product_sales = df.groupby('Item').agg({
            'Quantity': 'sum',
            'Total Price (INR)': 'sum',
            'Transaction ID': 'nunique'
        }).reset_index()
        
        product_sales.columns = ['product', 'quantity_sold', 'revenue', 'transaction_count']
        product_sales['avg_price'] = product_sales['revenue'] / product_sales['quantity_sold']
        product_sales = product_sales.sort_values('revenue', ascending=False)
        
        # Product performance by category (you might need to add categories)
        # For now, we'll use item types based on names
        def categorize_item(item):
            item_lower = item.lower()
            if any(word in item_lower for word in ['coffee', 'cappuccino', 'mocha', 'latte', 'espresso']):
                return 'Coffee'
            elif any(word in item_lower for word in ['cake', 'tart', 'cheesecake', 'fudge']):
                return 'Desserts'
            elif any(word in item_lower for word in ['salad', 'toast', 'bagel', 'pancakes']):
                return 'Food'
            elif any(word in item_lower for word in ['tea', 'lemonade', 'juice']):
                return 'Beverages'
            else:
                return 'Other'
        
        product_sales['category'] = product_sales['product'].apply(categorize_item)
        category_sales = product_sales.groupby('category')['revenue'].sum().reset_index()
        
        return jsonify({
            'top_products': product_sales.head(10).to_dict('records'),
            'category_sales': category_sales.to_dict('records'),
            'total_products': len(product_sales)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/hourly-sales')
def get_hourly_sales():
    """Get sales data by hour for heatmap and trends"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        # Hourly sales data
        hourly_data = df.groupby('Hour').agg({
            'Total Price (INR)': 'sum',
            'Transaction ID': 'nunique',
            'Quantity': 'sum'
        }).reset_index()
        
        hourly_data.columns = ['hour', 'revenue', 'transactions', 'quantity']
        hourly_data['avg_transaction_value'] = hourly_data['revenue'] / hourly_data['transactions']
        
        # Day of week analysis
        daily_hourly = df.groupby(['DayOfWeek', 'Hour'])['Total Price (INR)'].sum().reset_index()
        
        return jsonify({
            'hourly_data': hourly_data.to_dict('records'),
            'daily_hourly': daily_hourly.to_dict('records')
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/customer-insights')
def get_customer_insights():
    """Get customer behavior insights"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        # Transaction analysis
        transaction_analysis = df.groupby('Transaction ID').agg({
            'Total Price (INR)': 'sum',
            'Quantity': 'sum',
            'Item': 'count'
        }).reset_index()
        
        transaction_analysis.columns = ['transaction_id', 'total_value', 'total_items', 'unique_items']
        
        # Customer segments based on transaction value
        def segment_customer(value):
            if value < 200:
                return 'Low Value'
            elif value < 500:
                return 'Medium Value'
            else:
                return 'High Value'
        
        transaction_analysis['segment'] = transaction_analysis['total_value'].apply(segment_customer)
        segment_distribution = transaction_analysis['segment'].value_counts().to_dict()
        
        # Payment method preferences
        payment_preferences = df['Payment Method'].value_counts().to_dict()
        
        # Average transaction metrics
        avg_transaction_value = transaction_analysis['total_value'].mean()
        avg_items_per_transaction = transaction_analysis['total_items'].mean()
        
        return jsonify({
            'segment_distribution': segment_distribution,
            'payment_preferences': payment_preferences,
            'avg_transaction_value': round(avg_transaction_value, 2),
            'avg_items_per_transaction': round(avg_items_per_transaction, 2),
            'total_customers': len(transaction_analysis)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/sales-summary')
def get_sales_summary():
    """Get comprehensive sales summary for date range"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if start_date and end_date:
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date)
            df = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
        
        # Calculate various metrics
        total_revenue = df['Total Price (INR)'].sum()
        total_transactions = df['Transaction ID'].nunique()
        total_items_sold = df['Quantity'].sum()
        avg_transaction_value = df.groupby('Transaction ID')['Total Price (INR)'].sum().mean()
        
        # Top performing items
        top_items = df.groupby('Item')['Quantity'].sum().sort_values(ascending=False).head(5)
        
        # Revenue by payment method
        revenue_by_payment = df.groupby('Payment Method')['Total Price (INR)'].sum().to_dict()
        
        return jsonify({
            'total_revenue': round(total_revenue, 2),
            'total_transactions': total_transactions,
            'total_items_sold': total_items_sold,
            'avg_transaction_value': round(avg_transaction_value, 2),
            'top_items': top_items.to_dict(),
            'revenue_by_payment': revenue_by_payment
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/comprehensive-dashboard')
def get_comprehensive_dashboard():
    """Get all dashboard data in one comprehensive response"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        analytics = CafeAnalytics(df)
        
        return jsonify({
            'financial_kpis': analytics.get_financial_kpis(),
            'operational_kpis': analytics.get_operational_kpis(),
            'product_kpis': analytics.get_product_kpis(),
            'customer_kpis': analytics.get_customer_kpis(),
            'trend_analysis': analytics.get_trend_analysis('daily'),
            'hourly_analysis': analytics.get_hourly_analysis()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/kpis/financial')
def get_financial_kpis():
    """Get detailed financial KPIs"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        analytics = CafeAnalytics(df)
        return jsonify(analytics.get_financial_kpis())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/kpis/operational')
def get_operational_kpis():
    """Get detailed operational KPIs"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        analytics = CafeAnalytics(df)
        return jsonify(analytics.get_operational_kpis())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/kpis/products')
def get_product_kpis():
    """Get detailed product KPIs"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        analytics = CafeAnalytics(df)
        return jsonify(analytics.get_product_kpis())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/kpis/customers')
def get_customer_kpis():
    """Get detailed customer KPIs"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        analytics = CafeAnalytics(df)
        return jsonify(analytics.get_customer_kpis())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/trends')
def get_trends():
    """Get trend analysis for different periods"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        period = request.args.get('period', 'daily')
        analytics = CafeAnalytics(df)
        return jsonify(analytics.get_trend_analysis(period))
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/hourly-analysis')
def get_hourly_analysis():
    """Get detailed hourly analysis"""
    try:
        df = load_data()
        if df is None:
            return jsonify({'error': 'Failed to load data'}), 500
        
        analytics = CafeAnalytics(df)
        return jsonify(analytics.get_hourly_analysis())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
