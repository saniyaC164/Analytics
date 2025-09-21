import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

const Inventory = () => {
    return (
        <DashboardLayout>
            <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Inventory Management
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Stock & Inventory Analytics
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            This page will contain inventory management features including:
                        </Typography>
                        <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                            <li>Stock level monitoring</li>
                            <li>Inventory turnover analysis</li>
                            <li>Reorder point optimization</li>
                            <li>Waste reduction insights</li>
                            <li>Supply chain analytics</li>
                        </ul>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    );
};

export default Inventory;
