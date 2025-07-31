import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Avatar,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  PhotoCamera,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI, getImageUrl } from '../utils/api';
import ProductImage from '../components/ProductImage';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    features: '',
    specifications: '',
    isActive: true,
    images: []
  });

  const categories = ['Health & Fitness', 'Baby Safety Gear'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAllForAdmin();
      setProducts(response.data);
    } catch (error) {
      showSnackbar('Error fetching products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        features: product.features.join(', '),
        specifications: JSON.stringify(product.specifications || {}, null, 2),
        isActive: product.isActive,
        images: []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        features: '',
        specifications: '{}',
        isActive: true,
        images: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      features: '',
      specifications: '{}',
      isActive: true,
      images: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      showSnackbar('Maximum 5 images allowed', 'warning');
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('features', formData.features);
      formDataToSend.append('specifications', formData.specifications);
      formDataToSend.append('isActive', formData.isActive);

      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formDataToSend);
        showSnackbar('Product updated successfully', 'success');
      } else {
        await productsAPI.create(formDataToSend);
        showSnackbar('Product created successfully', 'success');
      }

      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await productsAPI.toggleStatus(productId);
      showSnackbar(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
      fetchProducts();
    } catch (error) {
      showSnackbar('Error updating product status', 'error');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        await productsAPI.delete(productId);
        showSnackbar('Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Product Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                }
              }}
            >
              Add Product
            </Button>
          </Box>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {filteredProducts.length} products
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence>
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {searchTerm || categoryFilter ? 'Try adjusting your filters' : 'Get started by adding your first product'}
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)'
                      }
                    }}>
                      <Box sx={{ position: 'relative' }}>
                        <ProductImage
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name}
                          variant="admin"
                        />
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          display: 'flex',
                          gap: 1
                        }}>
                          <Chip
                            size="small"
                            label={product.isActive ? 'Active' : 'Inactive'}
                            color={product.isActive ? 'success' : 'default'}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
                          {product.name}
                        </Typography>
                        <Chip 
                          label={product.category} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mb: 1 }} 
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4
                          }}
                        >
                          {product.description}
                        </Typography>
                      </CardContent>
                      
                      <Divider />
                      
                      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={product.isActive}
                              onChange={() => handleToggleStatus(product._id, product.isActive)}
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="caption">
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Typography>
                          }
                        />
                        
                        <Box>
                          <Tooltip title="Edit Product">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDialog(product)}
                              sx={{ color: 'primary.main' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add product"
          onClick={() => handleOpenDialog()}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Container>

      {/* Add/Edit Product Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleInputChange}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                  }
                  label="Active"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Features (comma separated)"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  helperText="Enter features separated by commas"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specifications (JSON format)"
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  placeholder='{"weight": "2kg", "dimensions": "30x20x15cm"}'
                  helperText="Enter specifications in JSON format"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    multiple
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Box sx={{ cursor: 'pointer' }}>
                      <PhotoCamera sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Upload Product Images
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to select images (max 5 files, 5MB each)
                      </Typography>
                      {formData.images.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1, color: 'primary.main' }}>
                          {formData.images.length} file(s) selected
                        </Typography>
                      )}
                    </Box>
                  </label>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleCloseDialog}
              startIcon={<CancelIcon />}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                }
              }}
            >
              {submitting ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProducts;
