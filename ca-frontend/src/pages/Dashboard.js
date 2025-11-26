import React from 'react';
import '../styles/globals.css';

const KPI = ({ title, value }) => (
    <div className="kpi-card simple">
        <div className="kpi-title">{title}</div>
        <div className="kpi-value">{value}</div>
    </div>
);

const ChartPlaceholder = ({ title }) => (
    <div className="chart-card">
        <div className="chart-title">{title}</div>
        <div className="chart-body">Chart placeholder</div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="dashboard-root">
            <header className="dashboard-header">
                <h1>Minimal Dashboard</h1>
            </header>

            <main className="dashboard-main">
                <section className="kpi-row">
                    <KPI title="Today's Revenue" value="₹0" />
                    <KPI title="Average Order Value" value="₹0" />
                    <KPI title="Transactions Today" value="0" />
                </section>

                <section className="charts-grid">
                    <ChartPlaceholder title="Weekly Sales Trend" />
                    <ChartPlaceholder title="Payment Distribution" />
                    <ChartPlaceholder title="Top 5 Best Sellers" />
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
