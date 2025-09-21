import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import DashboardLayout from '../layout/DashboardLayout';
import Navbar from '../layout/Navbar';
import KPIGrid from '../kpis/KPIGrid';
import RevenueChart from '../charts/RevenueChart';
import ProductSalesChart from '../charts/ProductSalesChart';
import PaymentMethodChart from '../charts/PaymentMethodChart';
import api from '../services/api';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch comprehensive dashboard data
            const [dashboardResponse, revenueResponse, productResponse] = await Promise.all([
                api.get('/dashboard-data'),
                api.get('/revenue-trends?period=daily'),
                api.get('/product-analytics')
            ]);

            setDashboardData(dashboardResponse.data);
            setRevenueData(revenueResponse.data);
            setProductData(productResponse.data.top_products || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleRefresh = () => {
        fetchDashboardData();
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Box textAlign="center">
                        <CircularProgress size={60} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading Dashboard...
                        </Typography>
                    </Box>
                </Box>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={handleRefresh}>
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <Box>
            <Navbar />
            <DashboardLayout>
                <Box>
                    {/* KPI Grid */}
                    <Box mb={4}>
                        <KPIGrid data={dashboardData} loading={loading} />
                    </Box>

                    {/* Charts Section */}
                    <Grid container spacing={3}>
                        {/* Revenue Chart */}
                        <Grid item xs={12} lg={8}>
                            <RevenueChart data={revenueData} loading={loading} />
                        </Grid>

                        {/* Payment Method Chart */}
                        <Grid item xs={12} lg={4}>
                            <PaymentMethodChart
                                data={dashboardData?.payment_distribution}
                                loading={loading}
                            />
                        </Grid>

                        {/* Product Sales Chart */}
                        <Grid item xs={12}>
                            <ProductSalesChart data={productData} loading={loading} />
                        </Grid>
                    </Grid>
                </Box>
            </DashboardLayout>
        </Box>
    );
};

export default Dashboard;
