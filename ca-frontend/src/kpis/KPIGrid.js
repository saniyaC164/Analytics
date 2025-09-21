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

    const kpiData = [
        {
            title: 'Daily Revenue',
            value: (data.total_revenue || 0) / 30, // Approximate daily revenue
            change: data.revenue_growth || 12.5,
            changeType: 'positive',
            icon: <RevenueIcon />,
            color: 'success',
            format: 'currency',
            subtitle: 'Today\'s revenue'
        },
        {
            title: 'Total Orders',
            value: data.total_transactions || 342,
            change: 8.2,
            changeType: 'positive',
            icon: <TransactionIcon />,
            color: 'primary',
            format: 'number',
            subtitle: 'Orders processed today'
        },
        {
            title: 'Customer Flow',
            value: Math.floor((data.total_transactions || 0) * 3.5), // Estimated customer flow
            change: -2.1,
            changeType: 'negative',
            icon: <CustomerIcon />,
            color: 'info',
            format: 'number',
            subtitle: 'Customers served today'
        },
        {
            title: 'Inventory Alert',
            value: 3,
            change: 0,
            changeType: 'neutral',
            icon: <WarningIcon />,
            color: 'error',
            format: 'number',
            subtitle: 'Items low in stock',
            alert: true
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
