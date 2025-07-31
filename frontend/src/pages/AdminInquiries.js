import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
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
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  WhatsApp as WhatsAppIcon,
  Call as CallIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { inquiriesAPI, formatDate } from '../utils/api';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusOptions = [
    { value: 'new', label: 'New', color: '#2196f3' },
    { value: 'contacted', label: 'Contacted', color: '#ff9800' },
    { value: 'converted', label: 'Converted', color: '#4caf50' },
    { value: 'closed', label: 'Closed', color: '#9e9e9e' }
  ];

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        setLoading(true);
        const response = await inquiriesAPI.getAll();
        setInquiries(response.data);
      } catch (error) {
        showSnackbar('Error fetching inquiries', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadInquiries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiriesAPI.getAll();
      setInquiries(response.data);
    } catch (error) {
      showSnackbar('Error fetching inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInquiry(null);
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await inquiriesAPI.updateStatus(inquiryId, newStatus);
      showSnackbar('Status updated successfully', 'success');
      fetchInquiries();
      if (selectedInquiry && selectedInquiry._id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      showSnackbar('Error updating status', 'error');
    }
  };

  const handleDeleteInquiry = async (inquiryId, customerName) => {
    if (window.confirm(`Are you sure you want to delete inquiry from "${customerName}"? This action cannot be undone.`)) {
      try {
        await inquiriesAPI.delete(inquiryId);
        showSnackbar('Inquiry deleted successfully', 'success');
        fetchInquiries();
        handleCloseDialog();
      } catch (error) {
        showSnackbar('Error deleting inquiry', 'error');
      }
    }
  };

  const handleWhatsApp = (phone, customerName, productName) => {
    const message = `Hello ${customerName}, Thank you for your inquiry about "${productName}". We would like to discuss your rental requirements. Best regards, Rentalhub.in`;
    const whatsappUrl = `https://wa.me/91${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = (phone) => {
    window.open(`tel:+91${phone.replace(/\D/g, '')}`, '_self');
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone.includes(searchTerm) ||
      inquiry.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedInquiries = filteredInquiries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || '#9e9e9e';
  };

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
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 4 }}>
            Inquiry Management
          </Typography>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statusOptions.map((status, index) => {
              const count = inquiries.filter(inquiry => inquiry.status === status.value).length;
              return (
                <Grid item xs={12} sm={6} md={3} key={status.value}>
                  <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: status.color }}>
                            {count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {status.label} Inquiries
                          </Typography>
                        </Box>
                        <Avatar sx={{ backgroundColor: status.color, width: 48, height: 48 }}>
                          <PersonIcon />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, phone, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    {statusOptions.map(status => (
                      <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {filteredInquiries.length} inquiries
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Inquiries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedInquiries.map((inquiry, index) => (
                    <TableRow 
                      key={inquiry._id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleViewInquiry(inquiry)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ backgroundColor: 'primary.main' }}>
                            {inquiry.customerName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {inquiry.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {inquiry.companyName && `${inquiry.companyName}`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {inquiry.productName || 'General Inquiry'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" />
                            {inquiry.email}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            {inquiry.phone}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusOptions.find(s => s.value === inquiry.status)?.label || inquiry.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(inquiry.status),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(inquiry.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="WhatsApp">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsApp(inquiry.phone, inquiry.customerName, inquiry.productName);
                              }}
                              sx={{ color: '#25d366' }}
                            >
                              <WhatsAppIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Call">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCall(inquiry.phone);
                              }}
                              sx={{ color: 'primary.main' }}
                            >
                              <CallIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewInquiry(inquiry);
                              }}
                              sx={{ color: 'info.main' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredInquiries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </motion.div>
      </Container>

      {/* Inquiry Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedInquiry && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Inquiry Details
                </Typography>
                <Chip
                  label={statusOptions.find(s => s.value === selectedInquiry.status)?.label || selectedInquiry.status}
                  sx={{
                    backgroundColor: getStatusColor(selectedInquiry.status),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    Customer Information
                  </Typography>
                  <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedInquiry.customerName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedInquiry.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedInquiry.phone}
                        </Typography>
                      </Grid>
                      {selectedInquiry.companyName && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedInquiry.companyName}
                          </Typography>
                        </Grid>
                      )}
                      {selectedInquiry.location && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedInquiry.location}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Product & Inquiry Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    Inquiry Details
                  </Typography>
                  <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Product</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedInquiry.productName || 'General Inquiry'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatDate(selectedInquiry.createdAt)}
                        </Typography>
                      </Grid>
                      {selectedInquiry.rentalDuration && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedInquiry.rentalDuration}
                          </Typography>
                        </Grid>
                      )}
                      {selectedInquiry.message && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mt: 1 }}>
                            {selectedInquiry.message}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Status Management */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon color="primary" />
                    Status Management
                  </Typography>
                  <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Update Status</InputLabel>
                      <Select
                        value={selectedInquiry.status}
                        label="Update Status"
                        onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                      >
                        {statusOptions.map(status => (
                          <MenuItem key={status.value} value={status.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%', 
                                  backgroundColor: status.color 
                                }} 
                              />
                              {status.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button 
                onClick={() => handleDeleteInquiry(selectedInquiry._id, selectedInquiry.customerName)}
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ borderRadius: 2 }}
              >
                Delete
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button 
                onClick={() => handleWhatsApp(selectedInquiry.phone, selectedInquiry.customerName, selectedInquiry.productName)}
                color="success"
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                sx={{ borderRadius: 2 }}
              >
                WhatsApp
              </Button>
              <Button 
                onClick={() => handleCall(selectedInquiry.phone)}
                variant="contained"
                startIcon={<CallIcon />}
                sx={{ 
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  }
                }}
              >
                Call
              </Button>
            </DialogActions>
          </>
        )}
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

export default AdminInquiries;
