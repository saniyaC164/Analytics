from flask import Blueprint, jsonify, render_template
import pandas as pd
from config import Config

# Define the main Blueprint
main = Blueprint('main', __name__)

@main.route('/')
def index():
    try:
        df = pd.read_csv(Config.CAFE_DATA)
        total_revenue = df['Total Price (INR)'].sum()
        avg_transaction = df['Total Price (INR)'].mean()
        total_transactions = len(df)
    except Exception as e:
        return render_template('index.html', 
                               error="Error loading transaction data", 
                               total_revenue=0, 
                               avg_transaction=0,
                               total_transactions=0)

    return render_template('index.html', 
                           total_revenue=total_revenue, 
                           avg_transaction=avg_transaction,
                           total_transactions=total_transactions)