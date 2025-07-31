import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  WhatsApp,
  Send,
  AccessTime,
  Support
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone sx={{ fontSize: 32 }} />,
      title: 'Phone',
      details: ['+91 98765 43210', '+91 87654 32109'],
      color: '#1976d2'
    },
    {
      icon: <Email sx={{ fontSize: 32 }} />,
      title: 'Email',
      details: ['info@rentalhub.in', 'support@rentalhub.in'],
      color: '#f50057'
    },
    {
      icon: <WhatsApp sx={{ fontSize: 32 }} />,
      title: 'WhatsApp',
      details: ['+91 98765 43210'],
      color: '#25d366'
    },
    {
      icon: <LocationOn sx={{ fontSize: 32 }} />,
      title: 'Address',
      details: ['India', 'Available across 50+ cities'],
      color: '#ff9800'
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM' }
  ];

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          mb: 6
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
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Have questions or need assistance? We're here to help you with 
              all your rental needs. Get in touch with us today!
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Send us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </Typography>

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you for your message! We'll get back to you soon.
                  </Alert>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        multiline
                        rows={6}
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={<Send />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                          }
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Contact Info Cards */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Get in Touch
                </Typography>
                <Grid container spacing={2}>
                  {contactInfo.map((info, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              backgroundColor: `${info.color}20`,
                              color: info.color,
                              width: 56,
                              height: 56
                            }}
                          >
                            {info.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {info.title}
                            </Typography>
                            {info.details.map((detail, idx) => (
                              <Typography
                                key={idx}
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.4 }}
                              >
                                {detail}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Business Hours */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Avatar
                    sx={{
                      backgroundColor: 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    <AccessTime />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Business Hours
                  </Typography>
                </Box>
                
                {businessHours.map((hour, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {hour.day}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {hour.hours}
                      </Typography>
                    </Box>
                    {index < businessHours.length - 1 && (
                      <Divider sx={{ opacity: 0.3 }} />
                    )}
                  </Box>
                ))}
              </Paper>

              {/* Quick Contact */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  textAlign: 'center'
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: 'success.main',
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Support sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Need Immediate Help?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  For urgent inquiries, contact us directly via WhatsApp
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<WhatsApp />}
                  sx={{
                    backgroundColor: '#25d366',
                    borderRadius: 2,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#128c7e',
                    }
                  }}
                >
                  WhatsApp Us
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 4
              }}
            >
              Frequently Asked Questions
            </Typography>
            
            <Grid container spacing={3}>
              {[
                {
                  question: 'How does the rental process work?',
                  answer: 'Simply browse our products, send an inquiry, and we\'ll contact you with rental options and pricing.'
                },
                {
                  question: 'What is the minimum rental duration?',
                  answer: 'Our minimum rental duration is 1 week, with flexible options up to 1 year or more.'
                },
                {
                  question: 'Do you provide delivery and pickup?',
                  answer: 'Yes, we provide free delivery and pickup services in all our service areas.'
                },
                {
                  question: 'Are the products sanitized?',
                  answer: 'Absolutely! All products are thoroughly cleaned and sanitized before delivery.'
                }
              ].map((faq, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
