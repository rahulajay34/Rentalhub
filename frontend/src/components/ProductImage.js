import React from 'react';
import { Box } from '@mui/material';
import SmartImage from './SmartImage';

/**
 * ProductImage component specifically designed for product displays
 * Handles different scenarios with optimal aspect ratios and fallbacks
 */
const ProductImage = ({ 
  src, 
  alt, 
  variant = 'card', // 'card', 'detail', 'thumbnail', 'hero'
  ...props 
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'card':
        return {
          height: 250,
          width: '100%',
          objectFit: 'smart',
          borderRadius: 2,
          hoverEffect: true
        };
      case 'detail':
        return {
          height: 500,
          width: '100%',
          objectFit: 'contain',
          borderRadius: 3,
          hoverEffect: false,
          backgroundColor: 'white'
        };
      case 'thumbnail':
        return {
          height: 80,
          width: 80,
          objectFit: 'contain',
          borderRadius: 1,
          hoverEffect: false,
          backgroundColor: '#f9f9f9'
        };
      case 'hero':
        return {
          height: 400,
          width: '100%',
          objectFit: 'smart',
          borderRadius: 3,
          hoverEffect: true
        };
      case 'admin':
        return {
          height: 200,
          width: '100%',
          objectFit: 'smart',
          borderRadius: 2,
          hoverEffect: true
        };
      default:
        return {};
    }
  };

  return (
    <SmartImage
      src={src}
      alt={alt}
      {...getVariantProps()}
      {...props}
    />
  );
};

/**
 * ResponsiveImage component that adapts to different screen sizes
 */
const ResponsiveImage = ({ 
  src, 
  alt, 
  sizes = {
    xs: { width: '100%', height: 200 },
    sm: { width: '100%', height: 250 },
    md: { width: '100%', height: 300 },
    lg: { width: '100%', height: 350 }
  },
  ...props 
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        '& .smart-image': {
          width: { xs: sizes.xs.width, sm: sizes.sm.width, md: sizes.md.width, lg: sizes.lg.width },
          height: { xs: sizes.xs.height, sm: sizes.sm.height, md: sizes.md.height, lg: sizes.lg.height }
        }
      }}
    >
      <SmartImage
        src={src}
        alt={alt}
        objectFit="smart"
        {...props}
      />
    </Box>
  );
};

export { ProductImage, ResponsiveImage };
export default ProductImage;
