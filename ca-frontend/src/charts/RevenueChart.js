import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const RevenueChart = ({ data, loading = false }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography>Loading revenue data...</Typography>
                </CardContent>
            </Card>
        );
    }

    if (!data || !Array.isArray(data)) {
        return (
            <Card>
                <CardContent>
                    <Typography color="error">No revenue data available</Typography>
                </CardContent>
            </Card>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card sx={{
            height: '100%',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 2,
            boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 1
                }}>
                    Weekly Sales Trend
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    mb: 3,
                    fontSize: '0.875rem'
                }}>
                    Revenue and order volume over the past week
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                stroke="rgba(17,24,39,0.6)"
                                fontSize={12}
                                tick={{ fill: 'rgba(17,24,39,0.6)' }}
                            />
                            <YAxis
                                tickFormatter={(value) => formatCurrency(value)}
                                stroke="rgba(17,24,39,0.6)"
                                fontSize={12}
                                tick={{ fill: 'rgba(17,24,39,0.6)' }}
                            />
                            <Tooltip
                                formatter={(value) => [formatCurrency(value), 'Revenue']}
                                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    borderRadius: '8px',
                                    boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                                    color: 'rgba(17,24,39,0.9)',
                                }}
                                labelStyle={{ color: 'rgba(17,24,39,0.9)' }}
                            />
                            <Legend
                                wrapperStyle={{ color: 'rgba(17,24,39,0.7)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#1976d2"
                                strokeWidth={3}
                                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RevenueChart;
