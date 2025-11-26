import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Chip,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';

const Navbar = ({ onMenuClick }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: '#1a1a1a',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 1200,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                {/* Left side - Logo and Title */}
                <Box display="flex" alignItems="center">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onMenuClick}
                        edge="start"
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <TrendingUpIcon sx={{ mr: 2, fontSize: 32, color: '#4caf50' }} />
                    <Box>
                        <Typography variant="h5" component="div" sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #4caf50, #81c784)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Café Analytics Dashboard
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.875rem',
                            mt: -0.5
                        }}>
                            AI-powered business intelligence for your café operations
                        </Typography>
                    </Box>
                </Box>

                {/* Right side - Actions */}
                <Box display="flex" alignItems="center" gap={2}>
                    {/* (AI Active removed for minimalist UI) */}

                    {/* Notifications */}
                    <IconButton color="inherit" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <NotificationsIcon />
                    </IconButton>

                    {/* Profile Menu */}
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: '#2d2d2d',
                                color: 'white',
                                mt: 1,
                            }
                        }}
                    >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;




