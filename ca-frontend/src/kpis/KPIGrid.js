import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import {
    AttachMoney as RevenueIcon,
    ShoppingCart as TransactionIcon,
    TrendingUp as GrowthIcon,
    People as CustomerIcon,
    Inventory as InventoryIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import KPICard from './KPICard';

const KPIGrid = ({ data, loading = false }) => {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>Loading KPIs...</Typography>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">Failed to load KPI data</Typography>
            </Box>
        );
    }

    // Map incoming API/dashboard data to the 3 requested minimal KPIs
    const kpiData = [
        {
            title: "Today's Revenue",
            value: data?.total_revenue || 0,
            change: data?.revenue_growth || 0,
            changeType: (data?.revenue_growth || 0) >= 0 ? 'positive' : 'negative',
            icon: <RevenueIcon />,
            format: 'currency',
            subtitle: "Today's revenue"
        },
        {
            title: 'Average Order Value',
            value: data?.avg_transaction_value || 0,
            change: 0,
            changeType: 'neutral',
            icon: <TransactionIcon />,
            format: 'currency',
            subtitle: 'Average order value'
        },
        {
            title: 'Transactions Today',
            value: data?.total_transactions || 0,
            change: data?.transaction_growth || 0,
            changeType: (data?.transaction_growth || 0) >= 0 ? 'positive' : 'negative',
            icon: <TransactionIcon />,
            format: 'number',
            subtitle: 'Transactions today'
        }
    ];

    return (
        <Box>
            <Grid container spacing={3}>
                {kpiData.map((kpi, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <KPICard {...kpi} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default KPIGrid;
