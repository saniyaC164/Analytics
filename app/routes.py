from flask import Blueprint, render_template
import pandas as pd
from config import Config

main = Blueprint('main', __name__)

@main.route('/')
def index():
    df = pd.read_csv(Config.CAFE_DATA)
    total_revenue = df['Total Price (INR)'].sum()
    avg_transaction = df['Total Price (INR)'].mean()
    total_transactions = len(df)
    
    return render_template('index.html', 
                           total_revenue=total_revenue, 
                           avg_transaction=avg_transaction,
                           total_transactions=total_transactions)