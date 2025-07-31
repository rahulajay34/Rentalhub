import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI, getImageUrl } from '../utils/api';
import ProductImage from '../components/ProductImage';

const Products = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Health & Fitness', label: 'Health & Fitness' },
    { value: 'Baby Safety Gear', label: 'Baby Safety Gear' }
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await productsAPI.getAll();
      
      // Handle different response structures
      let productsData;
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && Array.isArray(response.products)) {
        productsData = response.products;
      } else if (response && Array.isArray(response.data)) {
        productsData = response.data;
      } else {
        console.warn('Unexpected API response structure:', response);
        productsData = [];
      }
      
      // Validate that each product has required fields
      const validProducts = productsData.filter(product => 
        product && 
        typeof product === 'object' && 
        product._id && 
        product.name
      );
      
      setProducts(validProducts);
      
      // Initialize filtered products if no filters are applied
      if (selectedCategory === 'all' && !searchTerm) {
        setFilteredProducts(validProducts);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load products';
      setError(`Error: ${errorMessage}. Please try again later.`);
      console.error('Error fetching products:', err);
      setProducts([]); // Ensure products is always an array
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  // Memoized filter function to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    try {
      // Ensure products is always an array
      if (!products || !Array.isArray(products) || products.length === 0) {
        setFilteredProducts([]);
        return;
      }

      let filtered = products.slice(); // Create a copy

      // Filter by category
      if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product && product.category === selectedCategory
        );
      }

      // Filter by search term
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(product =>
          product && 
          product.name && 
          product.description &&
          (product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower))
        );
      }

      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error in applyFilters:', error);
      setFilteredProducts([]);
    }
  }, [products, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    // Only apply filters when not loading and we have products
    if (!loading && products) {
      applyFilters();
    }
  }, [loading, applyFilters, products]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    
    // Update URL
    if (newCategory === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${newCategory}`);
    }
  };

  const ProductCard = ({ product, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Card
        className="product-card hover-card"
        sx={{
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: viewMode === 'list' ? 'row' : 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          }
        }}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <ProductImage
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          variant="card"
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1 
        }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: viewMode === 'list' ? '1.25rem' : '1.1rem'
                }}
              >
                {product.name}
              </Typography>
              <Chip
                label={product.category}
                size="small"
                color="primary"
                sx={{ ml: 1, flexShrink: 0 }}
              />
            </Box>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: viewMode === 'list' ? 3 : 2,
                WebkitBoxOrient: 'vertical',
                mb: 2
              }}
            >
              {product.description}
            </Typography>

            {product.features && product.features.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                {product.features.slice(0, 3).map((feature, idx) => (
                  <Chip
                    key={idx}
                    label={feature}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
                {product.features.length > 3 && (
                  <Chip
                    label={`+${product.features.length - 3} more`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', opacity: 0.7 }}
                  />
                )}
              </Box>
            )}
          </CardContent>
          
          <CardActions sx={{ p: 2, pt: 0 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                py: 1.5,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                }
              }}
            >
              Enquire Now
            </Button>
          </CardActions>
        </Box>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: 400 }}>
            <Skeleton variant="rectangular" height={250} />
            <CardContent>
              <Skeleton variant="text" height={30} width="80%" />
              <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} width="90%" sx={{ mt: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton variant="rectangular" height={24} width={60} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={24} width={80} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ py: 4, minHeight: '80vh' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Our Products
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Discover our extensive collection of premium products available for rent. 
            Quality, convenience, and affordability all in one place.
          </Typography>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={handleCategoryChange}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 2,
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('grid')}
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <GridViewIcon />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('list')}
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <ListViewIcon />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Results Info */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Typography
              variant="body1"
              sx={{ mb: 3, color: 'text.secondary' }}
            >
              {filteredProducts.length === 0 
                ? 'No products found matching your criteria.'
                : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
              }
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </Typography>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert 
              severity="error" 
              sx={{ mb: 4 }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={fetchProducts}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Products Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchTerm}-${viewMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {filteredProducts.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    No products found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your search criteria or browse all products.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      navigate('/products');
                    }}
                    sx={{ mt: 2 }}
                  >
                    Show All Products
                  </Button>
                </Box>
              ) : (
                <Grid 
                  container 
                  spacing={3}
                  sx={{ 
                    display: viewMode === 'list' ? 'flex' : 'grid',
                    flexDirection: viewMode === 'list' ? 'column' : 'row'
                  }}
                >
                  {filteredProducts.map((product, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={viewMode === 'list' ? 12 : 6} 
                      md={viewMode === 'list' ? 12 : 4} 
                      key={product._id}
                    >
                      <ProductCard product={product} index={index} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Load More Button (for future pagination) */}
        {!loading && !error && filteredProducts.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </motion.div>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Products;
