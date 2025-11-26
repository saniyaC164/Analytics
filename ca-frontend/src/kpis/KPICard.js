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
                backgroundColor: 'white',
                border: '1px solid rgba(244,67,54,0.12)',
                borderRadius: 3,
                boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
            };
        }
        return {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 3,
            boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
        };
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.12s ease-in-out',
                backgroundColor: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 2,
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.04)'
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box flex={1}>
                        <Typography
                            color="text.secondary"
                            gutterBottom
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                fontSize: '1.5rem',
                                mb: 0.25
                            }}
                        >
                            {formatValue(value)}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    {icon && (
                        <Box sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 44,
                            minHeight: 44,
                        }}>
                            {icon}
                        </Box>
                    )}
                </Box>

                {change !== undefined && (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Typography variant="body2" color={getChangeColor()} sx={{ fontWeight: 700 }}>
                            {change > 0 ? '+' : ''}{change}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            vs yesterday
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default KPICard;
