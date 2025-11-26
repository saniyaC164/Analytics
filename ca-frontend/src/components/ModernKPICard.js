import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

const ModernKPICard = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    subtitle,
    gradient = 'blue',
    alert = false
}) => {
    const gradients = {
        blue: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
        green: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
        purple: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%)',
        red: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
        orange: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
    };

    const iconColors = {
        blue: '#3B82F6',
        green: '#10B981',
        purple: '#8B5CF6',
        red: '#EF4444',
        orange: '#F59E0B'
    };

    const formatValue = (val) => {
        if (typeof val === 'number') {
            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
            return val.toLocaleString();
        }
        return val;
    };

    const getTrendIcon = () => {
        if (changeType === 'positive') return <TrendingUpIcon sx={{ fontSize: 14 }} />;
        if (changeType === 'negative') return <TrendingDownIcon sx={{ fontSize: 14 }} />;
        return <TrendingFlatIcon sx={{ fontSize: 14 }} />;
    };

    const getTrendColor = () => {
        if (changeType === 'positive') return '#10B981';
        if (changeType === 'negative') return '#EF4444';
        return '#6B7280';
    };

    return (
        <Card sx={{
            background: gradients[gradient],
            backdropFilter: 'blur(10px)',
            border: alert ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                background: gradients[gradient].replace('0.1', '0.15').replace('0.05', '0.1')
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: 500,
                                mb: 1,
                                fontSize: '0.875rem'
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '2.25rem',
                                lineHeight: 1.1,
                                mb: subtitle ? 0.5 : 0
                            }}
                        >
                            {formatValue(value)}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '0.75rem'
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {Icon && (
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${iconColors[gradient]}20, ${iconColors[gradient]}10)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)'
                            }
                        }}>
                            <Icon sx={{ color: iconColors[gradient], fontSize: 24 }} />
                        </Box>
                    )}
                </Box>

                {change !== undefined && (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                            icon={getTrendIcon()}
                            label={`${change > 0 ? '+' : ''}${change}%`}
                            size="small"
                            sx={{
                                background: changeType === 'positive'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : changeType === 'negative'
                                        ? 'rgba(239, 68, 68, 0.2)'
                                        : 'rgba(107, 114, 128, 0.2)',
                                color: getTrendColor(),
                                border: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                    color: getTrendColor()
                                }
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.75rem'
                            }}
                        >
                            from yesterday
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ModernKPICard;
