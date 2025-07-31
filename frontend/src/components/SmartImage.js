import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

const SmartImage = ({
  src,
  alt = '',
  height = 200,
  width = '100%',
  borderRadius = 2,
  showSkeleton = true,
  objectFit = 'smart',
  backgroundColor = '#f5f5f5',
  hoverEffect = true,
  placeholder = '/placeholder-image.svg',
  className = '',
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setLoading(false);
      setError(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
    img.src = src;
  }, [src]);

  const getOptimalFit = () => {
    if (!imageDimensions.width || !imageDimensions.height) return 'contain';
    
    // Handle smart mode
    if (objectFit === 'smart') {
      const containerAspectRatio = typeof width === 'string' ? 16/9 : width / height;
      const imageAspectRatio = imageDimensions.width / imageDimensions.height;
      
      // If image is much wider than container, use contain to show full image
      if (imageAspectRatio > containerAspectRatio * 1.3) {
        return 'contain';
      }
      
      // If image is much taller than container, use contain to show full image  
      if (imageAspectRatio < containerAspectRatio * 0.8) {
        return 'contain';
      }
      
      // For similar aspect ratios, use cover for better visual appeal
      return 'cover';
    }
    
    // Return specified objectFit if not smart
    return objectFit;
  };

  if (loading && showSkeleton) {
    return (
      <Skeleton
        variant="rectangular"
        width={width}
        height={height}
        sx={{ borderRadius }}
        animation="wave"
      />
    );
  }

  if (error || !src) {
    return (
      <Box
        sx={{
          width,
          height,
          borderRadius,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '14px',
          textAlign: 'center',
          border: '1px dashed #ddd',
          backgroundImage: placeholder ? `url(${placeholder})` : 'none',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
        className={className}
      >
        {!placeholder && 'No Image Available'}
      </Box>
    );
  }

  const imageComponent = (
    <Box
      component="img"
      src={src}
      alt={alt}
      className={`smart-image ${className}`}
      sx={{
        width,
        height,
        objectFit: getOptimalFit(),
        borderRadius,
        backgroundColor,
        transition: 'all 0.3s ease',
        display: 'block',
        ...(hoverEffect && {
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
          }
        }),
        ...props.sx
      }}
      {...props}
    />
  );

  return hoverEffect ? (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {imageComponent}
    </motion.div>
  ) : (
    imageComponent
  );
};

export default SmartImage;
