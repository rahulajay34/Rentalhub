import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  QuestionAnswer as InquiriesIcon,
  QuestionAnswer,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  TrendingUp,
  People,
  Notifications,
  MoreVert,
  AdminPanelSettings
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inquiriesAPI } from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    closed: 0,
    recentInquiries: 0
  });
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <DashboardIcon />,
      active: true
    },
    { 
      label: 'Products', 
      path: '/admin/products', 
      icon: <ProductsIcon /> 
    },
    { 
      label: 'Inquiries', 
      path: '/admin/inquiries', 
      icon: <InquiriesIcon /> 
    },
    { 
      label: 'Settings', 
      path: '/admin/settings', 
      icon: <SettingsIcon /> 
    }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await inquiriesAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const statsCards = [
    {
      title: 'Total Inquiries',
      value: stats.total,
      color: '#1976d2',
      icon: <QuestionAnswer />,
      change: '+12%'
    },
    {
      title: 'New Inquiries',
      value: stats.new,
      color: '#2e7d32',
      icon: <Notifications />,
      change: '+5%'
    },
    {
      title: 'Converted',
      value: stats.converted,
      color: '#ed6c02',
      icon: <TrendingUp />,
      change: '+8%'
    },
    {
      title: 'Recent (30 days)',
      value: stats.recentInquiries,
      color: '#9c27b0',
      icon: <People />,
      change: '+15%'
    }
  ];

  const inquiryStatusData = [
    { label: 'New', value: stats.new, color: '#2196f3' },
    { label: 'Contacted', value: stats.contacted, color: '#ff9800' },
    { label: 'Converted', value: stats.converted, color: '#4caf50' },
    { label: 'Closed', value: stats.closed, color: '#9e9e9e' }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          backgroundColor: 'white',
          borderRight: '1px solid',
          borderColor: 'grey.200',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textAlign: 'center'
            }}
          >
            Rentalhub Admin
          </Typography>
        </Box>

        {/* Admin Info */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: 'primary.main',
                width: 48,
                height: 48
              }}
            >
              <AdminPanelSettings />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {admin?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation */}
        <List sx={{ flex: 1, px: 2, py: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: item.active ? 'primary.main' : 'transparent',
                  color: item.active ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: item.active ? 'primary.dark' : 'grey.100',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Logout */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              justifyContent: 'flex-start',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'grey.100',
                color: 'text.primary'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1, color: 'text.primary', fontWeight: 600 }}>
              Dashboard
            </Typography>
            <IconButton onClick={handleMenuClick} color="inherit">
              <MoreVert sx={{ color: 'text.primary' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Container maxWidth="xl" sx={{ px: 0 }}>
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome back, {admin?.username}!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Here's what's happening with your rental business today.
              </Typography>
            </motion.div>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statsCards.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                        border: `1px solid ${stat.color}30`
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {stat.title}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                              {loading ? '-' : stat.value}
                            </Typography>
                            <Chip
                              label={stat.change}
                              size="small"
                              color="success"
                              sx={{ mt: 1, fontSize: '0.75rem' }}
                            />
                          </Box>
                          <Avatar
                            sx={{
                              backgroundColor: stat.color,
                              width: 48,
                              height: 48
                            }}
                          >
                            {stat.icon}
                          </Avatar>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Inquiry Status Overview */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Inquiry Status Breakdown
                    </Typography>
                    
                    {loading ? (
                      <Box>
                        {[...Array(4)].map((_, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <LinearProgress sx={{ height: 8, borderRadius: 1 }} />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box>
                        {inquiryStatusData.map((item, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.value}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={stats.total > 0 ? (item.value / stats.total) * 100 : 0}
                              sx={{
                                height: 8,
                                borderRadius: 1,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: item.color,
                                  borderRadius: 1
                                }
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                </motion.div>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Quick Actions
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ProductsIcon />}
                        onClick={() => navigate('/admin/products')}
                        sx={{
                          justifyContent: 'flex-start',
                          py: 1.5,
                          borderRadius: 2
                        }}
                      >
                        Manage Products
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<InquiriesIcon />}
                        onClick={() => navigate('/admin/inquiries')}
                        sx={{
                          justifyContent: 'flex-start',
                          py: 1.5,
                          borderRadius: 2
                        }}
                      >
                        View Inquiries
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ProductsIcon />}
                        onClick={() => navigate('/admin/products')}
                        sx={{
                          justifyContent: 'flex-start',
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                          }
                        }}
                      >
                        Add New Product
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
