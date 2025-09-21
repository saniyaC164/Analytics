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
                    Weekly Sales Trend
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'rgba(255,255,255,0.7)',
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
                                stroke="rgba(255,255,255,0.7)"
                                fontSize={12}
                                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            />
                            <YAxis
                                tickFormatter={(value) => formatCurrency(value)}
                                stroke="rgba(255,255,255,0.7)"
                                fontSize={12}
                                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            />
                            <Tooltip
                                formatter={(value) => [formatCurrency(value), 'Revenue']}
                                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                                contentStyle={{
                                    backgroundColor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                    color: 'white',
                                }}
                                labelStyle={{ color: 'white' }}
                            />
                            <Legend
                                wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#42a5f5"
                                strokeWidth={3}
                                dot={{ fill: '#42a5f5', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#42a5f5', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RevenueChart;
