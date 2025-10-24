const rolePermissions: Record<string, string[]> = {
  owner: ['tenant:read', 'tenant:write', 'billing:manage', 'chat:read'],
  admin: ['tenant:read', 'billing:manage', 'chat:read'],
  agent: ['chat:read'],
};

export const hasPermission = (roles: string[], permission: string) =>
  roles.some((role) => rolePermissions[role]?.includes(permission));
