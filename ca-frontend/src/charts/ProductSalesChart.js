import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ProductSalesChart = ({ data, loading = false }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography>Loading product data...</Typography>
                </CardContent>
            </Card>
        );
    }

    if (!data || !Array.isArray(data)) {
        return (
            <Card>
                <CardContent>
                    <Typography color="error">No product data available</Typography>
                </CardContent>
            </Card>
        );
    }

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-IN').format(value);
    };

    const truncateText = (text, maxLength = 15) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    // ensure we only display top 5 best sellers by quantity_sold
    const top5 = data
        .slice()
        .sort((a, b) => (b.quantity_sold || 0) - (a.quantity_sold || 0))
        .slice(0, 5);

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
                    Menu Performance
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    mb: 3,
                    fontSize: '0.875rem'
                }}>
                    Top selling items breakdown
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={top5}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            layout="horizontal"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                type="number"
                                tickFormatter={formatNumber}
                                stroke="rgba(17,24,39,0.6)"
                                fontSize={12}
                                tick={{ fill: 'rgba(17,24,39,0.6)' }}
                            />
                            <YAxis
                                type="category"
                                dataKey="product"
                                tickFormatter={truncateText}
                                stroke="rgba(17,24,39,0.6)"
                                fontSize={12}
                                width={140}
                                tick={{ fill: 'rgba(17,24,39,0.6)' }}
                            />
                            <Tooltip
                                formatter={(value) => [formatNumber(value), 'Quantity Sold']}
                                labelFormatter={(label) => `Product: ${label}`}
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
                            <Bar
                                dataKey="quantity_sold"
                                fill="#1976d2"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductSalesChart;
