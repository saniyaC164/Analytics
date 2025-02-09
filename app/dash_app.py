import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd
from config import Config

def init_dashboard(server):
    dash_app = dash.Dash(
        __name__,
        server=server,
        url_base_pathname='/dash/',
        external_stylesheets=[dbc.themes.BOOTSTRAP]  # Add Bootstrap for better styling
    )
    
    df = pd.read_csv(Config.CAFE_DATA)
    df['Date'] = pd.to_datetime(df['Date'])

    # 📊 Create Figures (with better styling)
    def generate_daily_revenue_fig():
        daily_revenue = df.groupby('Date')['Total Price (INR)'].sum().reset_index()
        fig = px.bar(
            daily_revenue, x='Date', y='Total Price (INR)',
            title='Daily Revenue',
            template='plotly_dark',  # Apply dark mode to match Bootstrap theme
            color_discrete_sequence=['#1f77b4']
        )
        return fig

    def generate_popular_items_fig():
        item_counts = df['Items Purchased'].str.split(', ', expand=True).melt()['value'].value_counts().nlargest(10)
        fig = px.bar(
            item_counts, x=item_counts.index, y=item_counts.values,
            title='Top 10 Popular Items',
            template='plotly_dark',
            color_discrete_sequence=['#ff7f0e']
        )
        return fig

    # 🎨 Create Layout using Bootstrap Components
    dash_app.layout = dbc.Container([
        dbc.NavbarSimple(
            brand="Cafe Analytics Dashboard",
            brand_href="/",
            color="primary",
            dark=True,
            className="mb-4"
        ),
        dbc.Row([
            dbc.Col(dbc.Card([
                dbc.CardBody([
                    html.H5("Total Revenue", className="card-title"),
                    html.H2(f"₹{df['Total Price (INR)'].sum():,.2f}", className="text-success")
                ])
            ]), width=4),
            dbc.Col(dbc.Card([
                dbc.CardBody([
                    html.H5("Average Transaction", className="card-title"),
                    html.H2(f"₹{df['Total Price (INR)'].mean():,.2f}", className="text-primary")
                ])
            ]), width=4),
            dbc.Col(dbc.Card([
                dbc.CardBody([
                    html.H5("Total Transactions", className="card-title"),
                    html.H2(f"{len(df):,}", className="text-warning")
                ])
            ]), width=4)
        ], className="mb-4"),
        dbc.Row([
            dbc.Col(dcc.Graph(id='daily-revenue', figure=generate_daily_revenue_fig()), width=12),
        ]),
        dbc.Row([
            dbc.Col(dcc.Graph(id='popular-items', figure=generate_popular_items_fig()), width=12),
        ])
    ], fluid=True)

    return dash_app.server
