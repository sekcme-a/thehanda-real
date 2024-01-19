import { useState, useEffect } from "react"
import styles from "src/post/edit/program.module.css"
import {FUNCTION} from "src/post/edit/ProgramFunction"

import Stepper from "src/post/edit/Stepper"
import EditPost from "src/post/edit/EditPost"
import HandleSubmit from "src/post/edit/HandleSubmit"
import CustomForm from "src/post/edit/form/CustomForm"
import PublishSetting from "src/post/edit/PublishSetting/PublishSetting"
import { useRouter } from "next/router"
import { Button, CircularProgress } from "@mui/material"

import { firestore as db } from "firebase/firebase"


const STEPPER_STEP = [
  "게시물 작성",
  "폼 작성",
  "저장 및 게재",
]
const Program = () => {
  const router = useRouter()
  const {id, type, postId} = router.query
  const [step, setStep] = useState(0)
  const [postValues, setPostValues] = useState({
    isMain: false,
    type: "common",
    condition:"unconfirm",

    selectedSections: [],

    title: "",
    subtitle:"",
    dateText: "",
    
    thumbnailURL: "",

    welcome:"",
    info: [],
    quickLink: [],

    formData: [], 


    hasReserve: false, //예약게제?
    startAt: new Date,

    hasDeadline: false, //신청마감일
    endAt: new Date,  

    hasProgramStart: false, //프로그램 최초 시작일이 있나요?
    programStartAt: new Date,

    autoConfirm: false, //자동 참가확정

    hasLimit: false, //인원제한
    limitCount: 0,

    hasSchedule: false,
    
    history: []
  })

  const [formValues, setFormValues] = useState([

  ])

  const [calendar, setCalendar] = useState({colorValues: {}, data: []})

  const [isLoading, setIsLoading] = useState(true)


  useEffect(()=>{
    const fetchData = async () => {
      const postDataResult = await FUNCTION.fetch_post_data(id, type,  postId)
      if(postDataResult) setPostValues({...postDataResult})



      const calendarDoc = await db.collection("team").doc(id).get()
      if(postDataResult)
        setCalendar({data: postDataResult.calendar, colorValues: calendarDoc.data().programScheduleColorValues})
      else if(calendarDoc.data().programScheduleColorValues)
      setCalendar({data:[], colorValues: calendarDoc.data().programScheduleColorValues})

      setIsLoading(false)
    }

    fetchData()
  },[postId])

  const handleFormData = (data) => {
    setPostValues({...postValues, ["formData"]: [...data]})
  }


  if(isLoading)
    return(<CircularProgress />)

  return(
    <div className={styles.main_container}>
      <Stepper step={step} handleStep={(num) => setStep(num)} data={STEPPER_STEP}/>
    
      <div className={styles.content_container}>
        {step === 0 && <EditPost {...{postValues, setPostValues}} />}
        {step === 1 && <CustomForm contentMode formData={postValues.formData} setFormData={handleFormData} teamId={id} type="program" />}
        {step === 2 && <PublishSetting  {...{postValues, setPostValues, calendar, setCalendar}}  />}
        {step === 2 && <HandleSubmit {...{postValues, setPostValues, calendar, setCalendar, formValues, setFormValues}} />}

        <div className={styles.bottom_container}>
          {step === 0 &&
            <>
              <Button></Button>
              <Button onClick={()=> setStep(1)} variant="contained">{`다음 >`}</Button>
            </>
          }
          {step === 1 &&
            <>
              <Button onClick={()=> setStep(0)} variant="contained">{`< 이전`}</Button>
              <Button onClick={()=> setStep(2)} variant="contained">{`다음 >`}</Button>
            </>
          }
          {step === 2 &&
            <>
              <Button onClick={()=> setStep(1)} variant="contained">{`< 이전`}</Button>

            </>
          }
        </div>
      </div>


    </div>
  )
}

export default Program