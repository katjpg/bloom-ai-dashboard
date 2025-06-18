// API URL configuration
export const getApiUrl = () => {
  // Check if we have an environment variable set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default to local development server
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // Production builds must set NEXT_PUBLIC_API_URL environment variable
  throw new Error('NEXT_PUBLIC_API_URL environment variable must be set for production builds');
};

// Log current API URL in development
if (process.env.NODE_ENV === 'development') {
  console.log(`🌐 API URL: ${getApiUrl()}`);
}