/* A simple utility function to check if a user has a specific permission

  Example usage:
  const userPermissions = ['read:dashboard', 'write:dashboard']
  const canReadDashboard = can('read:dashboard', userPermissions) // true
  const canDeleteDashboard = can('delete:dashboard', userPermissions) // false
*/

export const can = (
  permission: string,
  permissions: string[]
): boolean => {
  return permissions.includes(permission)
}