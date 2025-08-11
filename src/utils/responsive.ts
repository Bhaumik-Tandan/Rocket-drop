import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Check if device is iPad - improved detection
export const isIPad = () => {
  // More comprehensive iPad detection
  const isIOS = Platform.OS === 'ios';
  
  // iPad detection based on screen dimensions
  // iPad Mini: 768x1024, iPad: 768x1024, iPad Pro: 1024x1366, iPad Air: 834x1112
  const isTabletSize = width >= 768 || height >= 768;
  
  // Check for specific iPad screen sizes
  const isIPadPro = width >= 1024 || height >= 1024;
  const isIPadAir = width >= 834 || height >= 834;
  const isIPadMini = width >= 768 || height >= 768;
  
  // Aspect ratio check (iPad is typically 4:3 or 3:4)
  const aspectRatio = width / height;
  const isTabletAspectRatio = aspectRatio >= 0.75 && aspectRatio <= 1.33;
  
  // Check if we're in forced iPad mode (for testing)
  const isForcedIPad = (global as any).forceIPadMode === true;
  
  return isIOS && (isTabletSize || isTabletAspectRatio || isIPadPro || isIPadAir || isIPadMini || isForcedIPad);
};

// Get responsive dimensions
export const getResponsiveDimensions = () => {
  const isTablet = isIPad();
  
  // Calculate better scaling based on screen size
  const baseWidth = 375; // iPhone base width
  const baseHeight = 812; // iPhone base height
  const scaleFactor = isTablet ? Math.min(width / baseWidth, height / baseHeight) : 1;
  
  // More aggressive scaling for iPad
  const ipadScaleFactor = isTablet ? Math.max(1.5, scaleFactor) : 1;
  
  return {
    isTablet,
    screenWidth: width,
    screenHeight: height,
    scaleFactor: ipadScaleFactor,
    // Responsive font sizes - more aggressive scaling for iPad
    titleSize: isTablet ? Math.round(42 * ipadScaleFactor) : 42,
    subtitleSize: isTablet ? Math.round(14 * ipadScaleFactor) : 14,
    bodySize: isTablet ? Math.round(12 * ipadScaleFactor) : 12,
    smallSize: isTablet ? Math.round(10 * ipadScaleFactor) : 10,
    // Responsive spacing - proportional to screen size
    padding: isTablet ? Math.round(20 * ipadScaleFactor) : 20,
    margin: isTablet ? Math.round(20 * ipadScaleFactor) : 20,
    // Responsive game elements - scaled for better gameplay
    rocketSize: isTablet ? Math.round(30 * ipadScaleFactor) : 30,
    pipeWidth: isTablet ? Math.round(60 * ipadScaleFactor) : 60,
    pipeGap: isTablet ? Math.round(200 * ipadScaleFactor) : 200,
    // Responsive UI elements
    buttonSize: isTablet ? Math.round(44 * ipadScaleFactor) : 44,
    iconSize: isTablet ? Math.round(20 * ipadScaleFactor) : 20,
    hudPadding: isTablet ? Math.round(20 * ipadScaleFactor) : 20,
    hudTopPadding: isTablet ? Math.round(60 * ipadScaleFactor) : 60,
  };
};

// Get responsive styles for different components
export const getResponsiveStyles = () => {
  const dims = getResponsiveDimensions();
  
  return {
    container: {
      paddingHorizontal: dims.padding,
      paddingVertical: dims.margin,
    },
    title: {
      fontSize: dims.titleSize,
      marginBottom: dims.margin,
    },
    subtitle: {
      fontSize: dims.subtitleSize,
      marginBottom: dims.margin,
    },
    button: {
      paddingHorizontal: dims.padding,
      paddingVertical: dims.margin,
      borderRadius: dims.isTablet ? 16 : 12,
    },
    hud: {
      padding: dims.hudPadding,
      paddingTop: dims.hudTopPadding,
    },
  };
};

// Debug function to check responsive detection
export const debugResponsive = () => {
  const dims = getResponsiveDimensions();
  const isIOS = Platform.OS === 'ios';
  const aspectRatio = width / height;
  

  
  // Detailed iPad detection breakdown

  
  return dims;
}; 