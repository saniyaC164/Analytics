import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Paper,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Analytics as AnalyticsIcon,
    ShoppingCart as ShoppingCartIcon,
    SentimentSatisfied as SentimentIcon,
    Inventory as InventoryIcon,
    Assessment as ReportsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const tabItems = [
    { label: 'Overview', path: '/', icon: <DashboardIcon /> },
    { label: 'Sales Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
    { label: 'Inventory', path: '/inventory', icon: <InventoryIcon /> },
    { label: 'Customer Insights', path: '/sentiment', icon: <SentimentIcon /> },
    { label: 'AI Forecast', path: '/reports', icon: <ReportsIcon /> },
    { label: 'Market Basket', path: '/mba', icon: <ShoppingCartIcon /> },
];

const DashboardLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleTabChange = (event, newValue) => {
        const selectedTab = tabItems[newValue];
        if (selectedTab) {
            navigate(selectedTab.path);
        }
    };

    const getCurrentTabIndex = () => {
        return tabItems.findIndex(item => item.path === location.pathname);
    };

    const drawer = (
        <Box>
            <List>
                {tabItems.map((item, index) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) {
                                    setMobileOpen(false);
                                }
                            }}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname === item.path ? '#4caf50' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#0f0f0f',
        }}>
            {/* Main Content */}
            <Box sx={{ flexGrow: 1, pt: 8 }}>
                {/* Desktop Tabs */}
                <Paper
                    elevation={0}
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        backgroundColor: '#1a1a1a',
                        borderRadius: 0,
                        borderBottom: '1px solid #333',
                    }}
                >
                    <Tabs
                        value={getCurrentTabIndex()}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 500,
                                textTransform: 'none',
                                minHeight: 48,
                                '&.Mui-selected': {
                                    color: '#4caf50',
                                    fontWeight: 'bold',
                                },
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#4caf50',
                                height: 3,
                            },
                        }}
                    >
                        {tabItems.map((item, index) => (
                            <Tab
                                key={item.label}
                                label={item.label}
                                icon={item.icon}
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>
                </Paper>

                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 280,
                            backgroundColor: '#1a1a1a',
                            color: 'white',
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Page Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: '#0f0f0f',
                        minHeight: 'calc(100vh - 64px)',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;