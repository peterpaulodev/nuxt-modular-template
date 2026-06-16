class PermissionsService {
  can(permission: string) {
    return true
  }
}

export const permissionsService = new PermissionsService()