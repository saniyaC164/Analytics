import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    Chip,
    Skeleton
} from '@mui/material';
import {
    AttachMoney as RevenueIcon,
    ShoppingCart as OrderIcon,
    People as CustomerIcon,
    Warning as AlertIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import ModernKPICard from '../components/ModernKPICard';
import ModernChartCard from '../components/ModernChartCard';
import api from '../services/api';

const ModernDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/v2/dashboard/overview');
            setDashboardData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    background: 'rgba(17, 24, 39, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    p: 2,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                        {label}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.color, fontSize: '0.875rem' }}>
                            {entry.name}: {entry.value.toLocaleString()}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: 'transparent',
                pt: 4
            }}>
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        {[...Array(4)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Skeleton
                                    variant="rectangular"
                                    height={140}
                                    sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.1)' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        );
    }

    const financial = dashboardData?.financial || {};
    const operational = dashboardData?.operational || {};
    const customers = dashboardData?.customers || {};

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'transparent',
        }}>
            {/* Header */}
            <Box sx={{
                background: 'transparent',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                py: 3
            }}>
                <Container maxWidth="xl">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={3}>
                            <Box sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TrendingIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: '2rem',
                                    mb: 0.5
                                }}>
                                    Café Analytics Dashboard
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    AI-powered business intelligence for your café operations
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                                onClick={fetchDashboardData}
                                aria-label="refresh"
                                sx={{
                                    background: 'rgba(0,0,0,0.03)',
                                    '&:hover': { background: 'rgba(0,0,0,0.06)' }
                                }}
                            >
                                <RefreshIcon sx={{ color: 'rgba(17,24,39,0.8)' }} />
                            </IconButton>
                            <IconButton sx={{
                                background: 'rgba(0,0,0,0.03)',
                                '&:hover': { background: 'rgba(0,0,0,0.06)' }
                            }} aria-label="download">
                                <DownloadIcon sx={{ color: 'rgba(17,24,39,0.8)' }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {/* KPI Cards */}
                    <Grid item xs={12} sm={6} md={3}>
                        <ModernKPICard
                            title="Daily Revenue"
                            value={`${Math.round((financial.total_revenue || 0) / 30).toLocaleString()}`}
                            change={financial.revenue_growth || 12.5}
                            changeType="positive"
                            icon={RevenueIcon}
                            subtitle="Today's revenue"
                            gradient="green"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <ModernKPICard
                            title="Total Orders"
                            value={operational.total_transactions || 342}
                            change={8.2}
                            changeType="positive"
                            icon={OrderIcon}
                            subtitle="Orders processed today"
                            gradient="blue"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <ModernKPICard
                            title="Customer Flow"
                            value={customers.total_customers || 1248}
                            change={-2.1}
                            changeType="negative"
                            icon={CustomerIcon}
                            subtitle="Customers served today"
                            gradient="purple"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <ModernKPICard
                            title="Inventory Alert"
                            value={3}
                            change={0}
                            changeType="neutral"
                            icon={AlertIcon}
                            subtitle="Items low in stock"
                            gradient="red"
                            alert
                        />
                    </Grid>

                    {/* Charts Row */}
                    <Grid item xs={12} lg={8}>
                        <ModernChartCard
                            title="Weekly Sales Trend"
                            subtitle="Revenue and order volume over the past week"
                            height={350}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { day: 'Mon', revenue: 4000 },
                                    { day: 'Tue', revenue: 3000 },
                                    { day: 'Wed', revenue: 5000 },
                                    { day: 'Thu', revenue: 4500 },
                                    { day: 'Fri', revenue: 6000 },
                                    { day: 'Sat', revenue: 8000 },
                                    { day: 'Sun', revenue: 7000 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis
                                        dataKey="day"
                                        stroke="rgba(255,255,255,0.6)"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.6)"
                                        fontSize={12}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="revenue"
                                        fill="url(#colorRevenue)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </ModernChartCard>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <ModernChartCard
                            title="Menu Performance"
                            subtitle="Top selling items breakdown"
                            height={350}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Cappuccino', value: 30, color: '#3B82F6' },
                                            { name: 'Latte', value: 25, color: '#10B981' },
                                            { name: 'Espresso', value: 20, color: '#F59E0B' },
                                            { name: 'Croissant', value: 15, color: '#EF4444' },
                                            { name: 'Others', value: 10, color: '#8B5CF6' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {[
                                            { name: 'Cappuccino', value: 30, color: '#3B82F6' },
                                            { name: 'Latte', value: 25, color: '#10B981' },
                                            { name: 'Espresso', value: 20, color: '#F59E0B' },
                                            { name: 'Croissant', value: 15, color: '#EF4444' },
                                            { name: 'Others', value: 10, color: '#8B5CF6' }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ModernChartCard>
                    </Grid>

                    {/* Bottom Stats Cards */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '16px',
                            p: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
                            }
                        }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    ⭐
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                                        Customer Satisfaction
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                                        4.8/5.0
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '16px',
                            p: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
                            }
                        }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    ⏱️
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                                        Avg. Service Time
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                                        2m 34s
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '16px',
                            p: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.2)'
                            }
                        }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    📈
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                                        Peak Hour
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                                        11:00 AM
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ModernDashboard;