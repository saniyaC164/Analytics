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
        external_stylesheets=[dbc.themes.BOOTSTRAP]  
    )
    
    # Load the dataset
    df = pd.read_csv(Config.CAFE_DATA)
    df["Date"] = pd.to_datetime(df["Date"])
    df["Revenue"] = df["Quantity"] * df["Total Price (INR)"]
    print(df["Payment Method"].unique())

    # Aggregate counts for each payment method
    payment_counts = df["Payment Method"].value_counts().reset_index()
    payment_counts.columns = ["Payment Method", "Count"]

    # Group by product and sum the quantity sold
    top_products = df.groupby("Items Purchased")["Quantity"].sum().reset_index()

    # Sort in descending order and take the top 10
    top_products = top_products.sort_values(by="Quantity", ascending=False).head(10)

    # Create a bar chart
    fig = px.bar(
    top_products, 
    x="Quantity", 
    y="Items Purchased",  
    orientation="h",  
    #title="Top 10 Most Sold Products", 
    template='plotly_dark', 
    labels={"Quantity": "Total Sold", "Product Name": "Product"},
    text_auto=True
)

    # Reverse the order to show highest at the top
    fig.update_layout(yaxis=dict(categoryorder="total ascending"))

    # Group by week (start of the week) and sum revenue
    weekly_revenue = df.resample("W", on="Date")["Revenue"].sum().reset_index()
    monthly_revenue = df.resample("ME", on="Date")["Revenue"].sum().reset_index()


    fig_weekly = px.line(
    weekly_revenue, 
    x="Date", 
    y="Revenue", 
    #title="Weekly Revenue Trend",
    template='plotly_dark',
    labels={"Date": "Week", "Revenue": "Total Revenue (₹)"},
    markers=True
    )

    fig_payment = px.pie(
    payment_counts, 
    names="Payment Method", 
    values="Count", 
    #title="Payment Method Distribution",
    template='plotly_dark',  
    hole=0.4,  # Creates a donut-style chart
    color_discrete_sequence=px.colors.qualitative.Set3  # Color palette
    )
    
    #Layout
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
            html.H2("Top 10 most sold products"),
            dbc.Col(dcc.Graph(id='bar-chart', figure=fig), width=12),
            #dbc.Col(dcc.Graph(id='daily-revenue', figure=generate_daily_revenue_fig()), width=12),
        ]),

        html.Div(children=[  
        html.H3("Weekly Revenue Growth"),  
        dcc.Graph(figure=fig_weekly), 

        html.Div(children=[  
        html.H3("Payment Method Distribution"),  
        dcc.Graph(figure=fig_payment),
    ])   
    ])
    ], fluid=True)

    return dash_app.server
