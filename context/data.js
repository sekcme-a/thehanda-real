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
                id: userDoc.id,
                realName_additionalRealname: `${userDoc.data().basicProfile?.realName} ${userDoc.data().additionalProfile?.realName ? `(${userDoc.data().additionalProfile?.realName })` : ""}`,
                phoneNumber_additionalPhoneNumber: `${userDoc.data().basicProfile?.phoneNumber}  ${userDoc.data().additionalProfile?.phoneNumber ? `(${userDoc.data().additionalProfile?.phoneNumber })` : ""}`,
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
    const [programThumbnailList, setProgramThumbnailList] = useState(null)
    const fetch_program_thumbnailList = async (teamId, isReload) => {
      if(programThumbnailList===null || isReload){
        const snapShot = await db.collection("team").doc(teamId).collection(`programs_thumbnail`).orderBy("savedAt", "desc").get()
        if(!snapShot.empty){
          const thumbnailDocs = snapShot.docs.map((doc)=>{
            return({...doc.data(), id: doc.id})
          })
          setProgramThumbnailList([...thumbnailDocs])
          return thumbnailDocs
        }
      }
      return programThumbnailList
    }
    const [surveyThumbnailList, setSurveyThumbnailList] = useState(null)
    const fetch_survey_thumbnailList = async (teamId, isReload) => {
      if(surveyThumbnailList===null || isReload){
        const snapShot = await db.collection("team").doc(teamId).collection(`surveys_thumbnail`).orderBy("savedAt", "desc").get()
        if(!snapShot.empty){
          const thumbnailDocs = snapShot.docs.map((doc)=>{
            return({...doc.data(), id: doc.id})
          })
          setSurveyThumbnailList([...thumbnailDocs])
          return thumbnailDocs
        }
      }
      return surveyThumbnailList
    }
    const [announcementList, setAnnouncementList] = useState(null)
    const fetch_announcementList = async (teamId, isReload) => {
      if(announcementList===null || isReload){
        const snapShot = await db.collection("team").doc(teamId).collection("announcements").orderBy("savedAt", "desc").get()
        if(!snapShot.empty){
          const list = snapShot.docs.map((doc) => {
            return({...doc.data(), id: doc.id})
          })
          setAnnouncementList(list)
          return list
        }
      }
      return announcementList
    }



    //=======스케쥴========//

    //calendar [{colorValues:{red:"asdf", blue:"asdf"}, data: [{}] }]
    const [calendar, setCalendar] = useState()

    const [alarmType, setAlarmType] = useState([])

    //프로그램 스케쥴에 추가할 사용자지정 스케쥴 (프로그램에 포함되어있지 않은 스케쥴)
    const [programCustomSchedule, setProgramCustomSchedule] = useState()
    //프로그램 스케쥴들
    const [programSchedule, setProgramSchedule] = useState()

    useEffect(()=>{
        const fetchData = async() => {
            if(team && team.teamId!==""){

                //fetching calendar
                db.collection("team_admin").doc(team.teamId).get().then((doc) => {
                    if(doc.exists && doc.data().calendar)
                        setCalendar(doc.data().calendar)
                    else
                        setCalendar({colorValues: {red:"",yellow:"",green:"",blue:"",purple:""}, data:[]})
                })
            }
        }
        fetchData() 
    },[team])
    

    const value = {
      teamList, setTeamList, fetch_team_list,
      team, setTeam, fetch_team,
      userList, setUserList,
      fetch_userList,
      programThumbnailList, setProgramThumbnailList, fetch_program_thumbnailList,
      surveyThumbnailList, setSurveyThumbnailList, fetch_survey_thumbnailList,
      announcementList, setAnnouncementList, fetch_announcementList,
      calendar,setCalendar,alarmType,setAlarmType,
      programCustomSchedule,setProgramCustomSchedule,
      programSchedule,setProgramSchedule
    }

    return <dataContext.Provider value={value} {...props} />
}