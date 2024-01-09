import { firestore as db } from "firebase/firebase"

export const FUNCTION = {
  fetch_admin_user_list : async(teamId) => {
    const doc = await db.collection("team").doc(teamId).get()
    if(doc.exists && doc.data().adminUsers){
      return doc.data().adminUsers
    } else return null
  },
  // fetch_user_data_from_uid_list : async(list) => {
  //   const data_list = list.map( async (uid) => {
  //     const doc = await db.collection("user").doc(uid).get()
  //     if(doc.exists) return doc.data()
  //   }).filter(Boolean)
  //   return data_list
  // }
  fetch_user_data_from_uid_list: (list) => {
    const data_promises = list.map((uid) => {
      return db.collection("user").doc(uid).get()
        .then((doc) => {
          if (doc.exists) {
            return {...doc.data(), id: doc.id}
          }
          return null;
        })
        .catch((error) => {
          console.error(`Error fetching user data for UID ${uid}:`, error);
          return null;
        });
    });
  
    return Promise.all(data_promises)
      .then((data_list) => data_list.filter(Boolean));
  },

  applied_uid_list : async(teamId) => {
    const query = await db.collection("team").doc(teamId).collection("application").orderBy("sendedAt", "desc").get()
    const list = query.docs.map((doc) => doc.id)
    return list
  },
  
  cancel_authority : async (teamId, uid) => {

    function removeFromArray(arr, valueToRemove) {
      const index = arr.indexOf(valueToRemove);
      if (index !== -1) {
        arr.splice(index, 1);
      }
      return arr;
    }

    function removeStringFromArray(arr, stringToRemove) {
      return arr.filter(item => !item.includes(stringToRemove));
    }

    const batch = db.batch()

    //team_admin 에서 해당 uid를 users 에서 제외
    const adminDoc = await db.collection("team").doc(teamId).get()
    const usersUid = adminDoc.data().adminUsers
    const newUsersUid = removeFromArray(usersUid, uid)
    console.log(newUsersUid)
    batch.update(db.collection("team").doc(teamId), {adminUsers: newUsersUid})
    

    //해당 유저에게있는 roles 권한삭제
    const userDoc = await db.collection("user").doc(uid).get()
    const userRoles = userDoc.data().roles
    const newUserRoles = removeStringFromArray(userRoles, teamId)
    batch.update(db.collection("user").doc(uid), {roles: newUserRoles})
    
    await batch.commit()
  },

  has_super_authority : async (teamId, userData) => {
    if(userData.roles.includes("super_admin")||userData.roles.includes(`${teamId}_super_admin`))
      return true
    else
      return false
  },

  level_up_authority : async (teamId, userData) => {
    function replaceValueInArray(arr, oldValue, newValue) {
      return arr.map(item => (item === oldValue ? newValue : item));
    }

    //normal유저라면 high로 승격
    if(userData.roles.includes(`${teamId}_admin`)){
      const newRoles = replaceValueInArray(userData.roles, `${teamId}_admin`, `${teamId}_high_admin`)
      await db.collection("user").doc(userData.id).update({roles: newRoles})
    }
    else if(userData.roles.includes(`${teamId}_high_admin`)){
      const newRoles = replaceValueInArray(userData.roles, `${teamId}_high_admin`, `${teamId}_super_admin`)
      await db.collection("user").doc(userData.id).update({roles: newRoles})
    }
  },

  level_down_authority : async (teamId, userData) => {
    function replaceValueInArray(arr, oldValue, newValue) {
      return arr.map(item => (item === oldValue ? newValue : item));
    }

    //super유저라면 high로 강등
    if(userData.roles.includes(`${teamId}_super_admin`)){
      const newRoles = replaceValueInArray(userData.roles, `${teamId}_super_admin`, `${teamId}_high_admin`)
      await db.collection("user").doc(userData.id).update({roles: newRoles})
    }
    else if(userData.roles.includes(`${teamId}_high_admin`)){
      const newRoles = replaceValueInArray(userData.roles, `${teamId}_high_admin`, `${teamId}_admin`)
      await db.collection("user").doc(userData.id).update({roles: newRoles})
    }
  },
}