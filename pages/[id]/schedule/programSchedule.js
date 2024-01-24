import { useEffect, useState } from "react"
import useData from "context/data"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"
import Calendar from "src/public/components/Calendar"
import { Button, CircularProgress } from "@mui/material"

const TeamSchedule = () => {
  const {userData, team, setSubContent, programCustomSchedule, setProgramCustomSchedule, programSchedule, setProgramSchedule} = useData()
  const router = useRouter()
  const {team_id} = router.query
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [finalCalendar, setFinalCalendar] = useState({})


  useEffect(()=>{
    const fetchData = async() => {
      let colorValues = {}
      // if(!programCustomSchedule){
      //   //fetching programCustomSchedule
      //   const customScheduleDoc = await db.collection("team").doc(team.teamId).get()
      //   if(customScheduleDoc.exists){
      //     let tempSchedule={colorValues: {red:"",yellow:"",green:"",blue:"",purple:""}, data:[]}
      //     if(customScheduleDoc.data().customSchedule)
      //       tempSchedule = {...tempSchedule, data: customScheduleDoc.data().customSchedule}
      //     if(customScheduleDoc.data().programScheduleColorValues){
      //       tempSchedule = {...tempSchedule, colorValues: customScheduleDoc.data().programScheduleColorValues}
      //       colorValues = customScheduleDoc.data().programScheduleColorValues
      //     }
      //     setProgramCustomSchedule(tempSchedule)
      //   } else
      //     setProgramCustomSchedule({colorValues: {red:"",yellow:"",green:"",blue:"",purple:""}, data:[]})
      // }   
      if(!programSchedule){
        //프로그램 최초 시작일이 1년이내라면
        let date = new Date()
        date = date.setFullYear(date.getFullYear()-1)

        console.log(new Date(date))
        const customScheduleDoc = await db.collection("team").doc(team.teamId).get()
        if(customScheduleDoc.exists && customScheduleDoc.data().programScheduleColorValues)
          colorValues = customScheduleDoc.data().programScheduleColorValues
        const querySnapshot = await db.collection("team").doc(team.teamId).collection("programs").where("condition", "==","confirm").get()
        const fetchedData = []
        querySnapshot.docs.map((doc) => {
          if(doc.exists && doc.data().calendar){
            let tempCal = doc.data().calendar
            // tempCal = [...doc.data().calendar, ["extendedProps"]:{...doc.data().calendar.extendedProps, programId: doc.id} ]
            for (let i = 0; i < tempCal.length; i++) {
              // Add the programId to the extendedProps object of the current object
              tempCal[i].extendedProps.editProgramUrl = `https://thehanda.netlify.app/${team.teamId}/post/edit/programs/${doc.id}`
            }
            console.log(tempCal)
            fetchedData.push(...tempCal)
          }
        })
        if(fetchedData){
          console.log(fetchedData)
          setProgramSchedule({colorValues: colorValues, data: fetchedData})
        }
      }
    }
    fetchData()
    setIsLoading(false)
  },[])

  useEffect(()=>{
    let temp = {colorValues: {}, data: []}
    if(programSchedule)
      temp = {colorValues: programSchedule.colorValues, data: [...temp.data, ...programSchedule.data]}
    // if(programCustomSchedule)
    //   temp = {colorValues: programCustomSchedule.colorValues, data: [...temp.data,...programCustomSchedule.data]}
    setFinalCalendar({...temp})
  },[programSchedule, isLoading])

  // useEffect(()=>{
  //   console.log(calendar)  
  //   setIsLoading(true)
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   },50);
  // },[calendar])

  // const onSubmitClick = async () => {
  //   setIsSubmitting(true)
  //   await db.collection("team_admin").doc(team.teamId).update({
  //     calendar: calendar
  //   })
  //   setIsSubmitting(false)
  //   alert("적용되었습니다.")
  // }

  if(isLoading)
    return(<CircularProgress />)

  return(
    <div>

      <h1>*프로그램 스케쥴은 해당 프로그램에 들어가야 편집이 가능합니다.</h1>
   
      <p style={{fontSize:"14px", marginBottom:"10px", marginTop:"5px"}}>*변경사항은 새로고침 후 적용됩니다.</p>
      {/* <div style={{display:"flex", alignItems:"flex-end", marginBottom:"10px"}}>
        <Button variant="contained" size="small" onClick={onSubmitClick} disabled={isSubmitting}>{isSubmitting ? "저장 중입니다." : "스케쥴 저장"}</Button>
        <p style={{marginLeft:"10px", fontSize:"12px"}}>*저장을 눌러야 변경사항들이 적용됩니다.</p>
      </div> */}


      <Calendar events={finalCalendar} setEvents={setFinalCalendar} editable={false}/>   
    </div>
  )
}
export default TeamSchedule