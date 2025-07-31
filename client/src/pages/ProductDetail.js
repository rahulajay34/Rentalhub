import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link,
  IconButton,
  Card,
  Avatar
} from '@mui/material';
import {
  WhatsApp,
  Share,
  Favorite,
  FavoriteBorder,
  NavigateNext,
  CheckCircle,
  Security,
  LocalShipping,
  SupportAgent,
  Close,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { productsAPI, inquiriesAPI, getImageUrl, validateEmail, validatePhone } from '../utils/api';
import ProductImage from '../components/ProductImage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openInquiry, setOpenInquiry] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    customerName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    message: '',
    rentalDuration: '',
    location: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        setError('');
      } catch (err) {
        setError('Product not found or failed to load.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = (direction) => {
    if (!product?.images?.length) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleInquiryChange = (e) => {
    setInquiryData({
      ...inquiryData,
      [e.target.name]: e.target.value
    });
    setInquiryError('');
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateEmail(inquiryData.email)) {
      setInquiryError('Please enter a valid email address.');
      return;
    }

    if (!validatePhone(inquiryData.phone)) {
      setInquiryError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!validatePhone(inquiryData.whatsappNumber)) {
      setInquiryError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setInquiryLoading(true);
    setInquiryError('');

    try {
      await inquiriesAPI.submit({
        ...inquiryData,
        productId: product._id
      });
      
      setInquirySuccess(true);
      setInquiryData({
        customerName: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        message: '',
        rentalDuration: '',
        location: ''
      });
    } catch (err) {
      setInquiryError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const benefits = [
    {
      icon: <Security color="primary" />,
      title: 'Quality Assured',
      description: 'Thoroughly tested and sanitized'
    },
    {
      icon: <LocalShipping color="primary" />,
      title: 'Free Delivery',
      description: 'Delivered to your doorstep'
    },
    {
      icon: <SupportAgent color="primary" />,
      title: '24/7 Support',
      description: 'Always here to help'
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={24} width="60%" sx={{ mt: 1 }} />
            <Skeleton variant="text" height={20} width="40%" sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mt: 3, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={48} sx={{ mt: 3, borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          {error || 'Product not found'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 4 }}
          >
            <Link component={RouterLink} to="/" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to="/products" color="inherit">
              Products
            </Link>
            <Link 
              component={RouterLink} 
              to={`/products/${product.category}`} 
              color="inherit"
            >
              {product.category}
            </Link>
            <Typography color="text.primary">{product.name}</Typography>
          </Breadcrumbs>
        </motion.div>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ position: 'relative' }}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    height: 500,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <ProductImage
                        src={getImageUrl(product.images?.[currentImageIndex])}
                        alt={product.name}
                        variant="detail"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {product.images?.length > 1 && (
                    <>
                      <IconButton
                        onClick={() => handleImageChange('prev')}
                        sx={{
                          position: 'absolute',
                          left: 16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          }
                        }}
                      >
                        <ArrowBack />
                      </IconButton>
                      <IconButton
                        onClick={() => handleImageChange('next')}
                        sx={{
                          position: 'absolute',
                          right: 16,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          }
                        }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </>
                  )}
                </Paper>

                {/* Image Thumbnails */}
                {product.images?.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, overflow: 'auto' }}>
                    {product.images.map((image, index) => (
                      <Box
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        sx={{
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: currentImageIndex === index ? 'primary.main' : 'transparent',
                          borderRadius: 1,
                          transition: 'border-color 0.3s ease',
                          '&:hover': {
                            borderColor: 'primary.light',
                          }
                        }}
                      >
                        <ProductImage
                          src={getImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          variant="thumbnail"
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </motion.div>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.2
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setFavorite(!favorite)}
                    color="primary"
                  >
                    {favorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton onClick={handleShare} color="primary">
                    <Share />
                  </IconButton>
                </Box>
              </Box>

              <Chip
                label={product.category}
                color="primary"
                sx={{ mb: 3, fontWeight: 600 }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  mb: 4
                }}
              >
                {product.description}
              </Typography>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Specifications
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          py: 1,
                          borderBottom: index < Object.entries(product.specifications).length - 1 
                            ? '1px solid' 
                            : 'none',
                          borderColor: 'grey.200'
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {key}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => setOpenInquiry(true)}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    }
                  }}
                >
                  Enquire Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<WhatsApp />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  WhatsApp
                </Button>
              </Box>

              {/* Benefits */}
              <Grid container spacing={2}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        backgroundColor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mx: 'auto',
                          mb: 1,
                          backgroundColor: 'transparent'
                        }}
                      >
                        {benefit.icon}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Inquiry Dialog */}
      <Dialog
        open={openInquiry}
        onClose={() => setOpenInquiry(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Send Inquiry
            </Typography>
            <IconButton onClick={() => setOpenInquiry(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {inquirySuccess ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Inquiry Sent Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Thank you for your interest in {product.name}. We'll contact you soon 
                via WhatsApp or phone to discuss your rental requirements.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenInquiry(false);
                  setInquirySuccess(false);
                }}
              >
                Close
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleInquirySubmit}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please fill in your details and we'll get back to you with rental 
                options and pricing for <strong>{product.name}</strong>.
              </Typography>

              {inquiryError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {inquiryError}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="customerName"
                    value={inquiryData.customerName}
                    onChange={handleInquiryChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={inquiryData.email}
                    onChange={handleInquiryChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={inquiryData.phone}
                    onChange={handleInquiryChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    value={inquiryData.whatsappNumber}
                    onChange={handleInquiryChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Rental Duration</InputLabel>
                    <Select
                      name="rentalDuration"
                      value={inquiryData.rentalDuration}
                      onChange={handleInquiryChange}
                      label="Rental Duration"
                    >
                      <MenuItem value="1 week">1 Week</MenuItem>
                      <MenuItem value="2 weeks">2 Weeks</MenuItem>
                      <MenuItem value="1 month">1 Month</MenuItem>
                      <MenuItem value="2 months">2 Months</MenuItem>
                      <MenuItem value="3 months">3 Months</MenuItem>
                      <MenuItem value="6 months">6 Months</MenuItem>
                      <MenuItem value="1 year">1 Year</MenuItem>
                      <MenuItem value="custom">Custom Duration</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={inquiryData.location}
                    onChange={handleInquiryChange}
                    placeholder="City, State"
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Message (Optional)"
                    name="message"
                    value={inquiryData.message}
                    onChange={handleInquiryChange}
                    multiline
                    rows={3}
                    placeholder="Any specific requirements or questions..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        {!inquirySuccess && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setOpenInquiry(false)}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInquirySubmit}
              variant="contained"
              disabled={inquiryLoading}
              sx={{
                minWidth: 120,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                }
              }}
            >
              {inquiryLoading ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default ProductDetail;
