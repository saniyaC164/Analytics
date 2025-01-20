import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd
from config import Config

def init_dashboard(server):
    dash_app = dash.Dash(__name__, server=server, url_base_pathname='/dash/')
    
    df = pd.read_csv(Config.CAFE_DATA)
    df['Date'] = pd.to_datetime(df['Date'])
    
    dash_app.layout = html.Div([
        html.H1('Cafe Analytics Dashboard'),
        dcc.Graph(id='daily-revenue'),
        dcc.Graph(id='popular-items')
    ])
    
    @dash_app.callback(
        Output('daily-revenue', 'figure'),
        Input('daily-revenue', 'id')
    )
    def update_daily_revenue(id):
        daily_revenue = df.groupby('Date')['Total Price (INR)'].sum().reset_index()
        fig = px.line(daily_revenue, x='Date', y='Total Price (INR)', title='Daily Revenue')
        return fig
    
    @dash_app.callback(
        Output('popular-items', 'figure'),
        Input('popular-items', 'id')
    )
    def update_popular_items(id):
        item_counts = df['Items Purchased'].str.split(', ', expand=True).melt()['value'].value_counts().nlargest(10)
        fig = px.bar(item_counts, x=item_counts.index, y=item_counts.values, title='Top 10 Popular Items')
        return fig
    
    return dash_app.server
