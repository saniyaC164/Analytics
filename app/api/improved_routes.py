from flask import Blueprint, jsonify, request, current_app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
from datetime import datetime, timedelta
from app.services.data_service import CafeDataService
from app.services.analytics_service import AdvancedCafeAnalytics

# Setup rate limiting
limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)

# Initialize services
data_service = CafeDataService()
analytics_service = AdvancedCafeAnalytics(data_service)

api_v2 = Blueprint('api_v2', __name__, url_prefix='/api/v2')

@api_v2.errorhandler(Exception)
def handle_api_error(error):
    """Global error handler for API routes"""
    logger.error(f"API Error: {str(error)}")
    return jsonify({
        'error': 'An internal error occurred',
        'message': str(error) if current_app.debug else 'Internal server error',
        'timestamp': datetime.now().isoformat()
    }), 500

@api_v2.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0'
    })

@api_v2.route('/dashboard/overview')
@limiter.limit("30 per minute")
def get_dashboard_overview():
    """Get comprehensive dashboard overview with improved performance"""
    try:
        # Get query parameters
        date_range = request.args.get('date_range', 'all')
        force_refresh = request.args.get('refresh', 'false').lower() == 'true'
        
        if force_refresh:
            data_service.get_data(force_reload=True)
        
        # Get all KPIs
        financial_kpis = analytics_service.get_financial_kpis(date_range)
        operational_kpis = analytics_service.get_operational_kpis()
        customer_insights = analytics_service.get_customer_insights()
        product_performance = analytics_service.get_product_performance()
        
        return jsonify({
            'financial': financial_kpis,
            'operational': operational_kpis,
            'customers': customer_insights,
            'products': product_performance,
            'meta': {
                'last_updated': datetime.now().isoformat(),
                'data_freshness': 'cached' if not force_refresh else 'fresh',
                'api_version': '2.0'
            }
        })
        
    except Exception as e:
        logger.error(f"Dashboard overview error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api_v2.route('/analytics/trends')
@limiter.limit("20 per minute")
def get_trend_analysis():
    """Get detailed trend analysis"""
    try:
        period = request.args.get('period', 'daily')  # daily, weekly, monthly
        metric = request.args.get('metric', 'revenue')  # revenue, transactions, customers
        
        df = data_service.get_data()
        if df is None:
            return jsonify({'error': 'No data available'}), 500
        
        # Generate trend data based on period
        if period == 'daily':
            trend_data = df.groupby(df['Date'].dt.date).agg({
                'Total Price (INR)': 'sum',
                'Transaction ID': 'nunique',
                'Quantity': 'sum'
            }).reset_index()
        elif period == 'weekly':
            trend_data = df.groupby(df['Date'].dt.to_period('W')).agg({
                'Total Price (INR)': 'sum',
                'Transaction ID': 'nunique',
                'Quantity': 'sum'
            }).reset_index()
            trend_data['Date'] = trend_data['Date'].dt.start_time
        elif period == 'monthly':
            trend_data = df.groupby(df['Date'].dt.to_period('M')).agg({
                'Total Price (INR)': 'sum',
                'Transaction ID': 'nunique',
                'Quantity': 'sum'
            }).reset_index()
            trend_data['Date'] = trend_data['Date'].dt.start_time
        
        # Rename columns for consistency
        trend_data.columns = ['date', 'revenue', 'transactions', 'items_sold']
        
        # Calculate growth rates
        trend_data['revenue_growth'] = trend_data['revenue'].pct_change() * 100
        trend_data['transaction_growth'] = trend_data['transactions'].pct_change() * 100
        
        # Convert dates to strings for JSON serialization
        trend_data['date'] = trend_data['date'].dt.strftime('%Y-%m-%d')
        
        # Fill NaN values
        trend_data = trend_data.fillna(0)
        
        return jsonify({
            'trend_data': trend_data.round(2).to_dict('records'),
            'summary': {
                'total_periods': len(trend_data),
                'avg_revenue_growth': round(trend_data['revenue_growth'].mean(), 2),
                'avg_transaction_growth': round(trend_data['transaction_growth'].mean(), 2),
                'period': period,
                'metric': metric
            },
            'meta': {
                'generated_at': datetime.now().isoformat(),
                'api_version': '2.0'
            }
        })
        
    except Exception as e:
        logger.error(f"Trend analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api_v2.route('/analytics/realtime')
@limiter.limit("60 per minute")
def get_realtime_metrics():
    """Get real-time metrics for live dashboard updates"""
    try:
        df = data_service.get_data()
        if df is None:
            return jsonify({'error': 'No data available'}), 500
        
        # Get today's data
        today = datetime.now().date()
        today_data = df[df['Date'].dt.date == today]
        
        # Real-time metrics
        current_hour_sales = today_data[today_data['Hour'] == datetime.now().hour]['Total Price (INR)'].sum()
        today_total_sales = today_data['Total Price (INR)'].sum()
        today_transactions = today_data['Transaction ID'].nunique()
        current_avg_transaction = today_total_sales / today_transactions if today_transactions > 0 else 0
        
        # Compare with yesterday
        yesterday = today - timedelta(days=1)
        yesterday_data = df[df['Date'].dt.date == yesterday]
        yesterday_sales = yesterday_data['Total Price (INR)'].sum()
        
        growth_rate = ((today_total_sales - yesterday_sales) / yesterday_sales * 100) if yesterday_sales > 0 else 0
        
        return jsonify({
            'current_hour_sales': round(current_hour_sales, 2),
            'today_total_sales': round(today_total_sales, 2),
            'today_transactions': today_transactions,
            'avg_transaction_value': round(current_avg_transaction, 2),
            'daily_growth_rate': round(growth_rate, 2),
            'last_transaction_time': df['DateTime'].max().isoformat() if not df.empty else None,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Real-time metrics error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def register_improved_routes(app):
    """Register improved API routes with the Flask app"""
    limiter.init_app(app)
    app.register_blueprint(api_v2)