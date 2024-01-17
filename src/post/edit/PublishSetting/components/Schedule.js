import { FormControlLabel, Switch, Button, TextField, Dialog } from "@mui/material";
import Calendar from "./Calendar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { firestore as db } from "firebase/firebase";

import styles from "./Schedule.module.css"


const Schedule = ({postValues, setPostValues, calendar, setCalendar}) => {

  const router = useRouter()
  const {id, postId} = router.query


  //스케쥴 backdrop control
  const [openScheduleBackdrop, setOpenScheduleBackdrop] = useState("")
  //스케쥴 color 임시input 데이터
  const [colorInput, setColorInput] = useState({
    red:"",
    orange:"",
    yellow:"",
    green:"",
    blue:"",
    purple:""
  })


  const onColorValueChange= (color, value) => {
    setColorInput({...colorInput, [color]: value})
  }
  const onColorSubmit = async() => {
    if(confirm("적용하시겠습니까?\n(모든 프로그램 스케쥴에 동일 적용됩니다.)")){
      await db.collection("team").doc(id).update({
        programScheduleColorValues: colorInput
      })
      setCalendar({...calendar, colorValues: colorInput})
      alert("적용되었습니다.")
    }
  }


  return(
    <div style={{marginLeft:"15px"}}>
      <h1 style={{fontSize:"15px",marginBottom:"3px"}}>일정을 작성해주세요.</h1>
      {/* <p style={{fontSize:"11px", marginBottom:"10px"}}>*프로그램 최초 시작일 기준 1년내의 일저.</p> */}
      <FormControlLabel control={<Switch checked={postValues.hasSchedule} onChange={(e)=>setPostValues({...postValues, hasSchedule: e.target.checked})} size="small" />} label="스케쥴 사용 여부" />
      {postValues.hasSchedule && 
        <>
          <div style={{marginTop:"20px", marginBottom:"10px"}}>
            <Button variant="contained" onClick={()=>{
              if(calendar.colorValues)
                setColorInput(calendar.colorValues);
              setOpenScheduleBackdrop("editColor")
            }}
            size="small"
            sx={{bgcolor:"rgb(0,125,0)"}}
            >
              컬러 타입 편집
            </Button>
          </div>
          <Calendar events={calendar} setEvents={setCalendar} editable={true} hasAddScheduleButton={true}/>
        </>
      }



      <Dialog
        // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openScheduleBackdrop==="editColor"}
        onClose={()=>setOpenScheduleBackdrop("")}
      >
        <div style={{backgroundColor:"white", padding: "20px 30px", borderRadius:"4px"}}>
          <h1>색깔에 따른 타입 지정</h1>
          <p style={{fontSize:"13px", marginTop:"3px"}}>{`*모든 "프로그램 스케쥴"에 동일적용됩니다.`}</p>
          <div className={styles.color_container}>
            <div className={`${styles.dot} ${styles.red}`} />
            <p>빨강: </p>
            <TextField variant="standard" value={colorInput.red} onChange={(e)=>onColorValueChange("red",e.target.value)}/>
          </div>
          <div className={styles.color_container}>
            <div className={`${styles.dot} ${styles.yellow}`} />
            <p>노랑: </p>
            <TextField variant="standard" value={colorInput.yellow} onChange={(e)=>onColorValueChange("yellow",e.target.value)}/>
          </div>
          <div className={styles.color_container}>
            <div className={`${styles.dot} ${styles.green}`} />
            <p>초록: </p>
            <TextField variant="standard" value={colorInput.green} onChange={(e)=>onColorValueChange("green",e.target.value)}/>
          </div>
          <div className={styles.color_container}>
            <div className={`${styles.dot} ${styles.blue}`} />
            <p>파랑: </p>
            <TextField variant="standard" value={colorInput.blue} onChange={(e)=>onColorValueChange("blue",e.target.value)}/>
          </div>
          <div className={styles.color_container}>
            <div className={`${styles.dot} ${styles.purple}`} />
            <p>보라: </p>
            <TextField variant="standard" value={colorInput.purple} onChange={(e)=>onColorValueChange("purple",e.target.value)}/>
          </div>
          <Button variant="contained" size="small" onClick={onColorSubmit} fullWidth sx={{mt:"20px"}}>저 장</Button>
        </div>
      </Dialog>
    </div>
  )
}

export default Schedule