import pandas as pd
import numpy as np
from datetime import datetime, timedelta    

import pandas as pd
from datetime import datetime, timedelta
from functools import lru_cache
from typing import Dict, Optional

from app.services.data_service import CafeDataService


class AdvancedCafeAnalytics:
    """Enhanced analytics service with better performance and more insights"""

    def __init__(self, data_service: CafeDataService):
        self.data_service = data_service
    
    @lru_cache(maxsize=128)
    def get_financial_kpis(self, date_range: Optional[str] = None) -> Dict:
        """Calculate comprehensive financial KPIs with caching"""
        df = self.data_service.get_data()
        if df is None:
            raise ValueError("No data available")
        
        # Apply date filtering if specified
        if date_range:
            df = self._filter_by_date_range(df, date_range)
        
        # Calculate metrics
        total_revenue = float(df['Total Price (INR)'].sum())
        avg_transaction = float(df.groupby('Transaction ID')['Total Price (INR)'].sum().mean())
        total_transactions = int(df['Transaction ID'].nunique())
        
        # Growth calculations with better logic
        revenue_growth = self._calculate_growth_rate(df, 'Total Price (INR)', period='daily')
        transaction_growth = self._calculate_growth_rate(df, 'Transaction ID', period='daily', method='count')
        
        # Advanced metrics
        revenue_per_customer = total_revenue / total_transactions if total_transactions > 0 else 0
        daily_avg_revenue = float(df.groupby(df['Date'].dt.date)['Total Price (INR)'].sum().mean())
        
        return {
            'total_revenue': round(total_revenue, 2),
            'avg_transaction_value': round(avg_transaction, 2),
            'total_transactions': total_transactions,
            'revenue_growth': round(revenue_growth, 2),
            'transaction_growth': round(transaction_growth, 2),
            'revenue_per_customer': round(revenue_per_customer, 2),
            'daily_avg_revenue': round(daily_avg_revenue, 2),
            'last_updated': datetime.now().isoformat()
        }
    
    def get_operational_kpis(self) -> Dict:
        """Calculate operational KPIs with enhanced metrics"""
        df = self.data_service.get_data()
        if df is None:
            raise ValueError("No data available")
        
        # Basic operational metrics
        total_items_sold = int(df['Quantity'].sum())
        avg_items_per_transaction = float(df.groupby('Transaction ID')['Quantity'].sum().mean())
        
        # Time-based analysis
        hourly_performance = self._get_hourly_performance(df)
        peak_hours = hourly_performance.nlargest(3, 'revenue')[['hour', 'revenue']].to_dict('records')
        busiest_day = df.groupby('DayOfWeek')['Total Price (INR)'].sum().idxmax()
        
        # Service efficiency metrics
        avg_transaction_size = float(df.groupby('Transaction ID').size().mean())
        unique_items_per_day = float(df.groupby(df['Date'].dt.date)['Item'].nunique().mean())
        
        return {
            'total_items_sold': total_items_sold,
            'avg_items_per_transaction': round(avg_items_per_transaction, 2),
            'peak_hours': peak_hours,
            'busiest_day': busiest_day,
            'avg_transaction_size': round(avg_transaction_size, 2),
            'unique_items_per_day': round(unique_items_per_day, 2),
            'service_efficiency_score': self._calculate_efficiency_score(df),
            'last_updated': datetime.now().isoformat()
        }
    
    def get_customer_insights(self) -> Dict:
        """Enhanced customer behavior analysis"""
        df = self.data_service.get_data()
        if df is None:
            raise ValueError("No data available")
        
        # Transaction analysis
        transaction_analysis = df.groupby('Transaction ID').agg({
            'Total Price (INR)': 'sum',
            'Quantity': 'sum',
            'Item': 'count',
            'Hour': 'first',
            'DayOfWeek': 'first'
        }).reset_index()
        
        # Customer segmentation with improved logic
        # compute percentiles once to avoid recomputing inside the apply
        percentile_25 = transaction_analysis['Total Price (INR)'].quantile(0.25)
        percentile_75 = transaction_analysis['Total Price (INR)'].quantile(0.75)

        def segment_customer(value):
            if value < percentile_25:
                return 'Budget Conscious'
            elif value < percentile_75:
                return 'Regular Customer'
            else:
                return 'Premium Customer'

        transaction_analysis['segment'] = transaction_analysis['Total Price (INR)'].apply(segment_customer)
        segment_distribution = transaction_analysis['segment'].value_counts().to_dict()
        
        # Behavioral patterns
        peak_customer_hours = transaction_analysis.groupby('Hour').size().nlargest(3).to_dict()
        popular_days = transaction_analysis.groupby('DayOfWeek').size().nlargest(3).to_dict()
        
        # Payment analysis
        payment_preferences = df['Payment Method'].value_counts().to_dict()
        payment_by_amount = df.groupby('Payment Method')['Total Price (INR)'].mean().to_dict()
        
        return {
            'total_customers': len(transaction_analysis),
            'segment_distribution': segment_distribution,
            'peak_customer_hours': peak_customer_hours,
            'popular_days': popular_days,
            'payment_preferences': payment_preferences,
            'payment_by_amount': {k: round(v, 2) for k, v in payment_by_amount.items()},
            'avg_customer_value': round(transaction_analysis['Total Price (INR)'].mean(), 2),
            'customer_retention_indicator': self._calculate_retention_indicator(df),
            'last_updated': datetime.now().isoformat()
        }
    
    def get_product_performance(self) -> Dict:
        """Comprehensive product analysis"""
        df = self.data_service.get_data()
        if df is None:
            raise ValueError("No data available")
        
        # Product metrics
        product_analysis = df.groupby('Item').agg({
            'Quantity': 'sum',
            'Total Price (INR)': 'sum',
            'Transaction ID': 'nunique'
        }).reset_index()
        
        product_analysis.columns = ['product', 'quantity_sold', 'revenue', 'transaction_count']
        product_analysis['avg_price'] = product_analysis['revenue'] / product_analysis['quantity_sold']
        product_analysis['revenue_per_transaction'] = product_analysis['revenue'] / product_analysis['transaction_count']
        
        # Performance scoring
        product_analysis['performance_score'] = (
            (product_analysis['revenue'] / product_analysis['revenue'].max()) * 0.4 +
            (product_analysis['quantity_sold'] / product_analysis['quantity_sold'].max()) * 0.3 +
            (product_analysis['transaction_count'] / product_analysis['transaction_count'].max()) * 0.3
        )
        
        product_analysis = product_analysis.sort_values('performance_score', ascending=False)
        
        # Category analysis
        category_performance = self._categorize_products(product_analysis)
        
        return {
            'top_products': product_analysis.head(10).round(2).to_dict('records'),
            'category_performance': category_performance,
            'total_unique_products': len(product_analysis),
            'avg_product_price': round(product_analysis['avg_price'].mean(), 2),
            'best_performing_product': product_analysis.iloc[0]['product'] if len(product_analysis) > 0 else None,
            'underperforming_products': product_analysis.tail(5)['product'].tolist(),
            'last_updated': datetime.now().isoformat()
        }
    
    # Helper methods
    def _calculate_growth_rate(self, df: pd.DataFrame, column: str, period: str = 'daily', method: str = 'sum') -> float:
        """Calculate growth rate for a given column and period"""
        try:
            if period == 'daily':
                # use .dt.date to avoid time-of-day mismatches
                max_date = df['Date'].dt.date.max()
                prev_date = max_date - timedelta(days=1)

                if method == 'count':
                    current = df[df['Date'].dt.date == max_date]['Transaction ID'].nunique()
                    previous = df[df['Date'].dt.date == prev_date]['Transaction ID'].nunique()
                else:
                    current = df[df['Date'].dt.date == max_date][column].sum()
                    previous = df[df['Date'].dt.date == prev_date][column].sum()
                
                if previous > 0:
                    return ((current - previous) / previous) * 100
                return 0
        except Exception:
            return 0
    
    def _get_hourly_performance(self, df: pd.DataFrame) -> pd.DataFrame:
        """Get hourly performance metrics"""
        return df.groupby('Hour').agg({
            'Total Price (INR)': 'sum',
            'Transaction ID': 'nunique',
            'Quantity': 'sum'
        }).reset_index().rename(columns={
            'Hour': 'hour',
            'Total Price (INR)': 'revenue',
            'Transaction ID': 'transactions',
            'Quantity': 'quantity'
        })
    
    def _calculate_efficiency_score(self, df: pd.DataFrame) -> float:
        """Calculate service efficiency score based on various metrics"""
        try:
            # Metrics contributing to efficiency
            avg_items_per_transaction = df.groupby('Transaction ID')['Quantity'].sum().mean()
            peak_hour_utilization = len(df[df['Hour'].between(10, 14)]) / len(df)
            # numerator: number of distinct payment methods; denominator: total transactions
            payment_diversity = df['Payment Method'].nunique() / len(df) if len(df) > 0 else 0
            
            # Normalize and combine scores
            efficiency_score = (
                min(avg_items_per_transaction / 5, 1) * 0.4 +  # Normalized to max 5 items
                peak_hour_utilization * 0.4 +
                payment_diversity * 0.2
            ) * 100
            
            return round(efficiency_score, 1)
        except Exception:
            return 75.0  # Default efficiency score
    
    def _calculate_retention_indicator(self, df: pd.DataFrame) -> float:
        """Calculate customer retention indicator"""
        try:
            # Simple retention indicator based on repeat transactions
            transaction_counts = df.groupby('Transaction ID').size()
            repeat_customers = len(transaction_counts[transaction_counts > 1])
            total_customers = len(transaction_counts)
            
            return round((repeat_customers / total_customers) * 100, 1) if total_customers > 0 else 0
        except Exception:
            return 0
    
    def _categorize_products(self, product_df: pd.DataFrame) -> Dict:
        """Categorize products and analyze category performance"""
        def categorize_item(item):
            item_lower = item.lower()
            if any(word in item_lower for word in ['coffee', 'cappuccino', 'mocha', 'latte', 'espresso', 'americano']):
                return 'Coffee'
            elif any(word in item_lower for word in ['tea', 'chai', 'green tea', 'herbal']):
                return 'Tea & Beverages'
            elif any(word in item_lower for word in ['cake', 'tart', 'cheesecake', 'fudge', 'cookie', 'dessert']):
                return 'Desserts'
            elif any(word in item_lower for word in ['sandwich', 'salad', 'toast', 'bagel', 'pancakes', 'wrap']):
                return 'Food'
            elif any(word in item_lower for word in ['juice', 'smoothie', 'lemonade', 'soda']):
                return 'Cold Beverages'
            else:
                return 'Others'
        
        product_df['category'] = product_df['product'].apply(categorize_item)
        category_performance = product_df.groupby('category').agg({
            'revenue': 'sum',
            'quantity_sold': 'sum',
            'transaction_count': 'sum'
        }).round(2).to_dict('index')
        
        return category_performance
    
    def _filter_by_date_range(self, df: pd.DataFrame, date_range: str) -> pd.DataFrame:
        """Filter dataframe by date range"""
        today = datetime.now().date()
        
        if date_range == 'today':
            return df[df['Date'].dt.date == today]
        elif date_range == 'yesterday':
            return df[df['Date'].dt.date == (today - timedelta(days=1))]
        elif date_range == 'week':
            return df[df['Date'].dt.date >= (today - timedelta(days=7))]
        elif date_range == 'month':
            return df[df['Date'].dt.date >= (today - timedelta(days=30))]
        
        return df
