import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Paper,
  Chip
} from '@mui/material';
import {
  Security,
  Speed,
  SupportAgent,
  Verified,
  Star,
  Groups,
  TrendingUp,
  LocalShipping
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Security color="primary" sx={{ fontSize: 48 }} />,
      title: 'Quality First',
      description: 'We ensure all products meet the highest standards of quality and safety.'
    },
    {
      icon: <Speed color="primary" sx={{ fontSize: 48 }} />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery service to get products to you on time.'
    },
    {
      icon: <SupportAgent color="primary" sx={{ fontSize: 48 }} />,
      title: 'Expert Support',
      description: '24/7 customer support to help you with any questions or concerns.'
    },
    {
      icon: <Verified color="primary" sx={{ fontSize: 48 }} />,
      title: 'Trusted Service',
      description: 'Thousands of satisfied customers trust us for their rental needs.'
    }
  ];

  const stats = [
    { icon: <Groups />, number: '10,000+', label: 'Happy Customers' },
    { icon: <Star />, number: '500+', label: 'Products Available' },
    { icon: <LocalShipping />, number: '50+', label: 'Cities Covered' },
    { icon: <TrendingUp />, number: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 3
              }}
            >
              About Rentalhub.in
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Your trusted partner for premium rental solutions, making quality 
              products accessible and affordable for everyone.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4, color: 'text.secondary' }}>
                  At Rentalhub.in, we believe that everyone deserves access to quality products 
                  without the burden of ownership. Our mission is to make premium Health & Fitness 
                  equipment and Baby Safety Gear accessible through convenient, affordable rental solutions.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  We're committed to providing exceptional service, maintaining the highest standards 
                  of product quality, and building lasting relationships with our customers.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: 3,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Why Choose Rental?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Cost-Effective', 'Space Saving', 'Try Before Buy', 'Always Updated', 'No Maintenance'].map((benefit) => (
                      <Chip key={benefit} label={benefit} color="primary" />
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 6
              }}
            >
              Our Values
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-4px)',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: 'transparent'
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 6
              }}
            >
              Our Impact
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: 1
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Ready to Experience the Difference?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Join thousands of satisfied customers who trust Rentalhub.in 
                for their rental needs. Start browsing our products today!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                >
                  Browse Products
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 2,
                    }
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
