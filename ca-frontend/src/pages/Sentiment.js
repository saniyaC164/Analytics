import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import DashboardLayout from '../layout/DashboardLayout';

const Sentiment = () => {
    return (
        <DashboardLayout>
            <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Sentiment Analysis
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Customer Sentiment Insights
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            This page will contain sentiment analysis features including:
                        </Typography>
                        <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                            <li>Customer feedback analysis</li>
                            <li>Sentiment trends over time</li>
                            <li>Product sentiment scores</li>
                            <li>Service quality insights</li>
                            <li>Customer satisfaction metrics</li>
                        </ul>
                    </CardContent>
                </Card>
            </Box>
        </DashboardLayout>
    );
};

export default Sentiment;
