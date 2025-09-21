import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const COLORS = ['#1976d2', '#42a5f5', '#90caf9', '#bbdefb', '#e3f2fd'];

const PaymentMethodChart = ({ data, loading = false }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography>Loading payment data...</Typography>
                </CardContent>
            </Card>
        );
    }

    if (!data || typeof data !== 'object') {
        return (
            <Card>
                <CardContent>
                    <Typography color="error">No payment data available</Typography>
                </CardContent>
            </Card>
        );
    }

    // Convert object to array for Recharts
    const chartData = Object.entries(data).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
    }));

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-IN').format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {data.name}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        Transactions: {formatNumber(data.value)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card sx={{
            height: '100%',
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    mb: 1
                }}>
                    Payment Method Distribution
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'rgba(255,255,255,0.7)',
                    mb: 3,
                    fontSize: '0.875rem'
                }}>
                    Transaction payment preferences
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry) => (
                                    <span style={{ color: entry.color }}>{value}</span>
                                )}
                                wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodChart;
