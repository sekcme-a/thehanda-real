
import { useState } from "react"

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from "@mui/material"
import { sendMultipleNotification } from "src/public/hooks/notification"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import useUserData from "context/userData"

const AlarmDialog = ({isDialogOpen, setIsDialogOpen, checkedList}) => {
  const {team} = useData()
  const {userData}= useUserData()

  const [alertInput, setAlertInput]= useState({
    title: "",
    subtitle:"",
    text:""
  })

  const handleAlertInput = (e, type) => {
    setAlertInput(prevAlertInput => ({
      ...prevAlertInput,
      [type]: e.target.value
    }))
  }

  const onSendAlarmClick = async () => {
    if(alertInput.title==="" || alertInput.title===" ") alert("제목은 빈칸일 수 없습니다.")
    else if(alertInput.subtitle==="" || alertInput.subtitle===" ") alert("부제목은 빈칸일 수 없습니다.")
    else if(confirm("알림을 선택한 유저들에게 전송하시겠습니까?")){
      const batch = db.batch()

      checkedList.map((uid) => {
        batch.set(db.collection("user").doc(uid).collection("alarm").doc(), {
          createdAt: new Date(),
          mode: "programAlarm",
          read: false,
          text: alertInput.text,
          title: alertInput.title,
        })
      })
      await batch.commit()

      await sendMultipleNotification(checkedList, alertInput.title, alertInput.subtitle, 'alarm_program',"","", team.teamId, userData.name)

      alert("알림을 성공적으로 보냈습니다.")
        
    }
  }

  return(
    
    <Dialog open={isDialogOpen} onClose={()=>setIsDialogOpen(false)}>
      <DialogTitle>유저에게 보낼 알림 메시지를 작성해주세요.</DialogTitle>
      <DialogContent sx={{mb:"0", pb: 1}}>
        <DialogContentText style={{whiteSpace:"pre-line"}}>
          {`제목/부제목 내용은 모바일 알림창에 표시되게 됩니다.
          제목/내용 은 어플 내 알림 화면에 표시되게 됩니다. (부제목은 표시되지 않습니다.)`}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="제목"
          fullWidth
          variant="standard"
          value={alertInput.title}
          onChange={(e) => handleAlertInput(e, "title")}
        />
        <TextField
          autoFocus
          margin="dense"
          label="부제목"
          fullWidth
          variant="standard"
          value={alertInput.subtitle}
          onChange={(e) => handleAlertInput(e, "subtitle")}
        />
        <TextField
          autoFocus
          margin="dense"
          label="내용"
          multiline
          maxRows={6}
          fullWidth
          variant="standard"
          value={alertInput.text}
          onChange={(e) => handleAlertInput(e, "text")}
        />
        <p style={{marginTop:"20px", textAlign:"end"}}>{`선택한 ${checkedList.length}명의 사용자들에게 알림을 보냅니다.`}</p>
      </DialogContent>
      <DialogActions sx={{mt:"0"}}>
        <Button onClick={()=>setIsDialogOpen(false)} color="error">취소</Button>
        <Button onClick={onSendAlarmClick}>알림 보내기</Button>
      </DialogActions>
    </Dialog>
  )
}


export default AlarmDialog