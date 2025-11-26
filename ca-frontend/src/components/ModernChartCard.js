import React from 'react';
import { Card, CardContent, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { MoreVert as MoreIcon, FilterList as FilterIcon } from '@mui/icons-material';

const ModernChartCard = ({ title, subtitle, children, actions, height = 400 }) => {
    return (
        <Card sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1.125rem',
                                mb: subtitle ? 0.5 : 0
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    <Box display="flex" gap={1}>
                        {actions}
                        <Tooltip title="More options">
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white'
                                    }
                                }}
                            >
                                <MoreIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box sx={{ height, mt: 2 }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ModernChartCard;