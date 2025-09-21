import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

const Reports = () => {
    return (
        <DashboardLayout>
            <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Reports & Insights
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Business Reports
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            This page will contain comprehensive business reports including:
                        </Typography>
                        <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                            <li>Financial performance reports</li>
                            <li>Sales analysis reports</li>
                            <li>Customer insights reports</li>
                            <li>Operational efficiency reports</li>
                            <li>Export capabilities (PDF, Excel)</li>
                        </ul>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    );
};

export default Reports;
