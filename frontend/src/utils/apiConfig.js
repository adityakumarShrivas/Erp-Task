/**
 * Get the correct API base URL based on environment
 * - Development: uses '/api' with Vite proxy
 * - Production: uses VITE_API_URL from environment
 */
export const getApiBaseUrl = () => {
  const isDevelopment = import.meta.env.MODE === 'development'
  
  if (isDevelopment) {
    return '/api'
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  return `${apiUrl}/api`
}
