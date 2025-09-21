import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    TrendingFlat as TrendingFlatIcon,
    Warning as WarningIcon,
    AttachMoney as MoneyIcon,
    ShoppingCart as CartIcon,
    People as PeopleIcon,
    Inventory as InventoryIcon,
} from '@mui/icons-material';

const KPICard = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    color = 'primary',
    subtitle,
    progress,
    format = 'number',
    alert = false
}) => {
    const formatValue = (val) => {
        if (format === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(val);
        }
        if (format === 'percentage') {
            return `${val}%`;
        }
        if (format === 'number') {
            return new Intl.NumberFormat('en-US').format(val);
        }
        return val;
    };

    const getTrendIcon = () => {
        if (changeType === 'positive') return <TrendingUpIcon sx={{ fontSize: 16 }} />;
        if (changeType === 'negative') return <TrendingDownIcon sx={{ fontSize: 16 }} />;
        return <TrendingFlatIcon sx={{ fontSize: 16 }} />;
    };

    const getChangeColor = () => {
        if (changeType === 'positive') return '#4caf50';
        if (changeType === 'negative') return '#f44336';
        return '#666';
    };

    const getCardStyle = () => {
        if (alert) {
            return {
                backgroundColor: '#2d2d2d',
                border: '1px solid #f44336',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.1)',
            };
        }
        return {
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        };
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                ...getCardStyle(),
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: alert ? '0 8px 20px rgba(244, 67, 54, 0.2)' : '0 8px 20px rgba(0,0,0,0.2)',
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                        <Typography
                            color="rgba(255,255,255,0.7)"
                            gutterBottom
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                color: 'white',
                                fontSize: '2rem',
                                mb: 0.5
                            }}
                        >
                            {formatValue(value)}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ fontSize: '0.75rem' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {icon && (
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor: alert ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                                color: alert ? '#f44336' : '#4caf50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 48,
                                minHeight: 48,
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                </Box>

                {change !== undefined && (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                backgroundColor: changeType === 'positive' ? 'rgba(76, 175, 80, 0.1)' :
                                    changeType === 'negative' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(102, 102, 102, 0.1)',
                            }}
                        >
                            {getTrendIcon()}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: getChangeColor(),
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem'
                                }}
                            >
                                {change > 0 ? '+' : ''}{change}%
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ fontSize: '0.75rem' }}>
                            from yesterday
                        </Typography>
                    </Box>
                )}

                {progress !== undefined && (
                    <Box mt={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontSize: '0.75rem' }}>
                                Progress
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontSize: '0.75rem' }}>
                                {progress}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#4caf50',
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default KPICard;
