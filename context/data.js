import { createContext, useState, useEffect, useContext } from "react";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";

const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){
  const router = useRouter()
  const {id} = router.query
    const [teamList, setTeamList] = useState()
    const [team, setTeam]= useState()

  

    useEffect(()=>{
      if(id) fetch_team(id)
    },[id])

    const fetch_team_list = async() => {
      const list = await db.collection("team").get()
      const list_refined = list.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setTeamList(list_refined)
    }

    const fetch_team = async (id) => {
      const doc = await db.collection("team").doc(id).get()
      if(doc.exists){
        setTeam({
          ...doc.data(),
          id: doc.id
        })
        return doc.data()
      } else return null
    }


//====================================유저======================================

    const [userList, setUserList] = useState(null)

    const fetch_userList = async (teamId, isReload) => {

      //isReload 라면, fetched한 기록이 있어도 다시 fetch
      if(isReload===true || userList===null){
        const querySnapShot = await db.collection("team_admin").doc(teamId).collection("users").get()

        if(!querySnapShot.empty){

          const list = await Promise.all(
            querySnapShot.docs.map(async (doc) => {
              const userDoc = await db.collection("user").doc(doc.id).get()
              if(userDoc.exists && userDoc.data().basicProfile)
              return({
                ...userDoc.data(),
                ...userDoc.data().basicProfile,
                gender: userDoc.data().basicProfile.gender ==="male" ? "남자" : userDoc.data().basicProfile.gender ==="female" ? "여자" : "기타",
                countryFlag: `${userDoc.data().basicProfile.country.flag} ${userDoc.data().basicProfile.country.text}`,
                id: userDoc.id
              })
            })
          )


          setUserList(list.filter((item) => item !== undefined))
          return list.filter((item) => item !== undefined)
        }else {
          setUserList([])
          return []
        }
      }
    }


    //==========썸네일================//
    const [thumbnails, setThumbnails] = useState({
      programs: null,
      surveys: null,
      announcements: null
    })
    
    const fetch_thumbnails_list = async (type) => {
      
    }



    const value = {
      teamList, setTeamList, fetch_team_list,
      team, setTeam, fetch_team,
      userList, setUserList,
      fetch_userList
    }

    return <dataContext.Provider value={value} {...props} />
}