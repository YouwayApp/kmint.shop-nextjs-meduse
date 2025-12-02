/**
 * Utility functions for refreshing customer data across the application
 */

/**
 * Triggers a customer data refresh by dispatching custom events
 * This will cause UserActions component to re-fetch customer data
 */
export const triggerCustomerRefresh = () => {
  // Dispatch multiple events to ensure compatibility
  window.dispatchEvent(new CustomEvent('customer-changed'))
  window.dispatchEvent(new CustomEvent('auth-changed'))
}

/**
 * Triggers customer refresh after successful login
 */
export const triggerLoginRefresh = () => {
  window.dispatchEvent(new CustomEvent('login-success'))
  triggerCustomerRefresh()
}

/**
 * Triggers customer refresh after logout
 */
export const triggerLogoutRefresh = () => {
  window.dispatchEvent(new CustomEvent('logout-success'))
  triggerCustomerRefresh()
}

/**
 * Manually refresh customer data using the global function
 * This is a direct call to the refresh function
 */
export const refreshCustomerData = () => {
  if (typeof window !== 'undefined' && (window as any).refreshCustomer) {
    ;(window as any).refreshCustomer()
  }
}

/**
 * Hook for components that need to trigger customer refresh
 * Returns a function that can be called to refresh customer data
 */
export const useCustomerRefresh = () => {
  return {
    refreshCustomer: triggerCustomerRefresh,
    refreshAfterLogin: triggerLoginRefresh,
    refreshAfterLogout: triggerLogoutRefresh,
    directRefresh: refreshCustomerData,
  }
}
