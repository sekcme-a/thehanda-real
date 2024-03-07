export const PERMISSION = {
  isAdmin: (roles, teamId) => {
    if(roles.includes("super_admin")||roles.includes(`${teamId}_admin`)||roles.includes(`${teamId}_high_admin`)||roles.includes(`${teamId}_super_admin`))
      return true
    else return false
  },
  isHighOrSuperAdmin: (roles, teamId) => {
    if(roles.includes("super_admin")||roles.includes(`${teamId}_high_admin`)||roles.includes(`${teamId}_super_admin`))
      return true
    else return false
  },
  isSuperAdmin: (roles, teamId) => {
    if(roles.includes("super_admin")||roles.includes(`${teamId}_super_admin`))
      return true
    else return false
  },
}