import { useAuthStore } from '../store/auth.store';

/**
 * Hook to retrieve and evaluate the current user's role.
 * Simplifies role-based conditional rendering and authorization across the application.
 *
 * @returns Object containing the normalized role string and boolean flags for access control.
 */
export const useRole = () => {
  const storeRole = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  const rawRole = (storeRole || user?.role || 'user').toString();
  const role = rawRole.toLowerCase();

  return {
    rawRole,
    role,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isSuperAdmin: role === 'super_admin',
    isCustomer: role === 'customer',
    isTrainer: role === 'trainer' || role === 'profesor' || role === 'professor',
    isProfesor: role === 'trainer' || role === 'profesor' || role === 'professor',
    isStaff: role === 'staff',
  };
};
