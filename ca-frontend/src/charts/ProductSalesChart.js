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
                    Menu Performance
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'rgba(255,255,255,0.7)',
                    mb: 3,
                    fontSize: '0.875rem'
                }}>
                    Top selling items breakdown
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            layout="horizontal"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                type="number"
                                tickFormatter={formatNumber}
                                stroke="rgba(255,255,255,0.7)"
                                fontSize={12}
                                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            />
                            <YAxis
                                type="category"
                                dataKey="product"
                                tickFormatter={truncateText}
                                stroke="rgba(255,255,255,0.7)"
                                fontSize={12}
                                width={120}
                                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            />
                            <Tooltip
                                formatter={(value) => [formatNumber(value), 'Quantity Sold']}
                                labelFormatter={(label) => `Product: ${label}`}
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
                            <Bar
                                dataKey="quantity_sold"
                                fill="#42a5f5"
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
