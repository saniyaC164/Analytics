import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

const MBA = () => {
    return (
        <DashboardLayout>
            <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Market Basket Analysis
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Product Association Analysis
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            This page will contain Market Basket Analysis features including:
                        </Typography>
                        <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                            <li>Product association rules</li>
                            <li>Frequent itemsets analysis</li>
                            <li>Cross-selling opportunities</li>
                            <li>Product recommendation engine</li>
                            <li>Basket optimization insights</li>
                        </ul>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    );
};

export default MBA;




