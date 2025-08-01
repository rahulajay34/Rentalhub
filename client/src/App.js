import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminInquiries from './pages/AdminInquiries';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                } />
                <Route path="/admin/inquiries" element={
                  <ProtectedRoute>
                    <AdminInquiries />
                  </ProtectedRoute>
                } />

                {/* Public Routes */}
                <Route path="/" element={
                  <>
                    <Navbar />
                    <main>
                      <Home />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/products" element={
                  <>
                    <Navbar />
                    <main>
                      <Products />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/products/:category" element={
                  <>
                    <Navbar />
                    <main>
                      <Products />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/product/:id" element={
                  <>
                    <Navbar />
                    <main>
                      <ProductDetail />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/about" element={
                  <>
                    <Navbar />
                    <main>
                      <About />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/contact" element={
                  <>
                    <Navbar />
                    <main>
                      <Contact />
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
