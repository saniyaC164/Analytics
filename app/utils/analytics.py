import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

class CafeAnalytics:
    """Analytics utility class for cafe data processing"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self._preprocess_data()
    
    def _preprocess_data(self):
        """Preprocess the dataframe for analytics"""
        self.df['Date'] = pd.to_datetime(self.df['Date'])
        self.df['Time'] = pd.to_datetime(self.df['Time'], format='%H:%M:%S').dt.time
        self.df['DateTime'] = pd.to_datetime(self.df['Date'].astype(str) + ' ' + self.df['Time'].astype(str))
        self.df['Hour'] = self.df['DateTime'].dt.hour
        self.df['DayOfWeek'] = self.df['DateTime'].dt.day_name()
        self.df['Month'] = self.df['DateTime'].dt.month_name()
        self.df['Revenue'] = self.df['Quantity'] * self.df['Total Price (INR)']
        self.df['Week'] = self.df['Date'].dt.isocalendar().week
    
    def get_financial_kpis(self) -> Dict:
        """Calculate financial KPIs"""
        total_revenue = self.df['Total Price (INR)'].sum()
        avg_transaction = self.df.groupby('Transaction ID')['Total Price (INR)'].sum().mean()
        total_transactions = self.df['Transaction ID'].nunique()
        
        # Calculate growth metrics
        current_month_revenue = self.df[self.df['Date'].dt.month == self.df['Date'].dt.month.max()]['Total Price (INR)'].sum()
        previous_month_revenue = self.df[self.df['Date'].dt.month == self.df['Date'].dt.month.max() - 1]['Total Price (INR)'].sum()
        revenue_growth = ((current_month_revenue - previous_month_revenue) / previous_month_revenue * 100) if previous_month_revenue > 0 else 0
        
        # Daily revenue target (assuming 30 days in month)
        daily_target = current_month_revenue / 30
        actual_daily_avg = self.df.groupby(self.df['Date'].dt.date)['Total Price (INR)'].sum().mean()
        target_achievement = (actual_daily_avg / daily_target * 100) if daily_target > 0 else 0
        
        return {
            'total_revenue': round(float(total_revenue), 2),
            'avg_transaction_value': round(float(avg_transaction), 2),
            'total_transactions': int(total_transactions),
            'revenue_growth': round(float(revenue_growth), 2),
            'daily_target_achievement': round(float(target_achievement), 2),
            'current_month_revenue': round(float(current_month_revenue), 2)
        }
    
    def get_operational_kpis(self) -> Dict:
        """Calculate operational KPIs"""
        total_transactions = self.df['Transaction ID'].nunique()
        total_items_sold = self.df['Quantity'].sum()
        avg_items_per_transaction = self.df.groupby('Transaction ID')['Quantity'].sum().mean()
        
        # Peak hours analysis
        hourly_sales = self.df.groupby('Hour')['Total Price (INR)'].sum()
        peak_hour = int(hourly_sales.idxmax())
        peak_hour_revenue = float(hourly_sales.max())
        
        # Busiest day of week
        daily_sales = self.df.groupby('DayOfWeek')['Total Price (INR)'].sum()
        busiest_day = daily_sales.idxmax()
        
        # Average transaction duration (simplified - using time range)
        transaction_times = self.df.groupby('Transaction ID')['Time'].agg(['min', 'max'])
        transaction_duration = (pd.to_datetime(transaction_times['max'], format='%H:%M:%S') - 
                               pd.to_datetime(transaction_times['min'], format='%H:%M:%S')).dt.total_seconds() / 60
        avg_transaction_duration = transaction_duration.mean()
        
        return {
            'total_transactions': int(total_transactions),
            'total_items_sold': int(total_items_sold),
            'avg_items_per_transaction': round(float(avg_items_per_transaction), 2),
            'peak_hour': int(peak_hour),
            'peak_hour_revenue': round(float(peak_hour_revenue), 2),
            'busiest_day': str(busiest_day),
            'avg_transaction_duration': round(float(avg_transaction_duration), 2)
        }
    
    def get_product_kpis(self) -> Dict:
        """Calculate product-related KPIs"""
        # Top selling products
        product_sales = self.df.groupby('Item').agg({
            'Quantity': 'sum',
            'Total Price (INR)': 'sum',
            'Transaction ID': 'nunique'
        }).reset_index()
        
        product_sales.columns = ['product', 'quantity_sold', 'revenue', 'transaction_count']
        product_sales['avg_price'] = product_sales['revenue'] / product_sales['quantity_sold']
        product_sales = product_sales.sort_values('revenue', ascending=False)
        
        # Product performance score (combination of revenue and frequency)
        product_sales['performance_score'] = (
            product_sales['revenue'] / product_sales['revenue'].max() * 0.7 +
            product_sales['transaction_count'] / product_sales['transaction_count'].max() * 0.3
        )
        
        # Cross-sell analysis (items frequently bought together)
        transaction_items = self.df.groupby('Transaction ID')['Item'].apply(list).tolist()
        
        # Calculate cross-sell rate (simplified)
        multi_item_transactions = [items for items in transaction_items if len(items) > 1]
        cross_sell_rate = len(multi_item_transactions) / len(transaction_items) * 100
        
        return {
            'top_products': product_sales.head(10).to_dict('records'),
            'total_products': int(len(product_sales)),
            'cross_sell_rate': round(float(cross_sell_rate), 2),
            'avg_product_price': round(float(product_sales['avg_price'].mean()), 2),
            'best_performing_product': str(product_sales.iloc[0]['product']) if len(product_sales) > 0 else None
        }
    
    def get_customer_kpis(self) -> Dict:
        """Calculate customer-related KPIs"""
        # Transaction analysis
        transaction_analysis = self.df.groupby('Transaction ID').agg({
            'Total Price (INR)': 'sum',
            'Quantity': 'sum',
            'Item': 'count',
            'Date': 'min'
        }).reset_index()
        
        transaction_analysis.columns = ['transaction_id', 'total_value', 'total_items', 'unique_items', 'first_purchase']
        
        # Customer segments
        def segment_customer(value):
            if value < 200:
                return 'Low Value'
            elif value < 500:
                return 'Medium Value'
            else:
                return 'High Value'
        
        transaction_analysis['segment'] = transaction_analysis['total_value'].apply(segment_customer)
        segment_distribution = transaction_analysis['segment'].value_counts().to_dict()
        
        # Customer value metrics
        avg_customer_value = transaction_analysis['total_value'].mean()
        high_value_customers = len(transaction_analysis[transaction_analysis['segment'] == 'High Value'])
        high_value_percentage = (high_value_customers / len(transaction_analysis)) * 100
        
        # Payment preferences
        payment_distribution = self.df['Payment Method'].value_counts().to_dict()
        
        return {
            'total_customers': int(len(transaction_analysis)),
            'avg_customer_value': round(float(avg_customer_value), 2),
            'high_value_customers': int(high_value_customers),
            'high_value_percentage': round(float(high_value_percentage), 2),
            'segment_distribution': segment_distribution,
            'payment_distribution': payment_distribution
        }
    
    def get_trend_analysis(self, period: str = 'daily') -> Dict:
        """Get trend analysis for different periods"""
        if period == 'daily':
            trend_data = self.df.groupby(self.df['Date'].dt.date).agg({
                'Total Price (INR)': 'sum',
                'Transaction ID': 'nunique',
                'Quantity': 'sum'
            }).reset_index()
            trend_data.columns = ['date', 'revenue', 'transactions', 'items_sold']
        elif period == 'weekly':
            trend_data = self.df.groupby(self.df['Date'].dt.to_period('W')).agg({
                'Total Price (INR)': 'sum',
                'Transaction ID': 'nunique',
                'Quantity': 'sum'
            }).reset_index()
            trend_data['date'] = trend_data['Date'].dt.start_time.dt.date
            trend_data = trend_data[['date', 'Total Price (INR)', 'Transaction ID', 'Quantity']]
            trend_data.columns = ['date', 'revenue', 'transactions', 'items_sold']
        elif period == 'monthly':
            trend_data = self.df.groupby(self.df['Date'].dt.to_period('M')).agg({
                'Total Price (INR)': 'sum',
                'Transaction ID': 'nunique',
                'Quantity': 'sum'
            }).reset_index()
            trend_data['date'] = trend_data['Date'].dt.start_time.dt.date
            trend_data = trend_data[['date', 'Total Price (INR)', 'Transaction ID', 'Quantity']]
            trend_data.columns = ['date', 'revenue', 'transactions', 'items_sold']
        
        # Calculate growth rates
        trend_data['revenue_growth'] = trend_data['revenue'].pct_change() * 100
        trend_data['transaction_growth'] = trend_data['transactions'].pct_change() * 100
        
        # Convert date to string for JSON serialization
        trend_data['date'] = trend_data['date'].astype(str)
        
        return {
            'trend_data': trend_data.to_dict('records'),
            'avg_revenue_growth': round(float(trend_data['revenue_growth'].mean()), 2),
            'avg_transaction_growth': round(float(trend_data['transaction_growth'].mean()), 2)
        }
    
    def get_hourly_analysis(self) -> Dict:
        """Get detailed hourly analysis"""
        # Hourly sales data
        hourly_data = self.df.groupby('Hour').agg({
            'Total Price (INR)': 'sum',
            'Transaction ID': 'nunique',
            'Quantity': 'sum'
        }).reset_index()
        
        hourly_data.columns = ['hour', 'revenue', 'transactions', 'quantity']
        hourly_data['avg_transaction_value'] = hourly_data['revenue'] / hourly_data['transactions']
        hourly_data['avg_items_per_transaction'] = hourly_data['quantity'] / hourly_data['transactions']
        
        # Day of week vs hour heatmap data
        daily_hourly = self.df.groupby(['DayOfWeek', 'Hour'])['Total Price (INR)'].sum().reset_index()
        
        # Peak performance hours
        peak_hours = hourly_data.nlargest(3, 'revenue')[['hour', 'revenue']].to_dict('records')
        
        return {
            'hourly_data': hourly_data.to_dict('records'),
            'daily_hourly_heatmap': daily_hourly.to_dict('records'),
            'peak_hours': peak_hours,
            'busiest_hour': int(hourly_data.loc[hourly_data['revenue'].idxmax(), 'hour']),
            'quietest_hour': int(hourly_data.loc[hourly_data['revenue'].idxmin(), 'hour'])
        }
