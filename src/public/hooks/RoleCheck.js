

export const ROLE_CHECK = {

  is_over_super_admin : (userData) => {

    if(userData.roles.includes("super_admin") || userData.roles.includes(`${id}_super_admin`)) 
      return true
    else
      return false
  },

  is_over_high_admin : (userData) => {
    if(userData.roles.includes("super_admin") || userData.roles.includes(`${id}_super_admin`)||userData.roles.includes(`${id}_high_admin`)) 
      return true
    else
      return false
  }
}