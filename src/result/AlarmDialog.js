
import { useState } from "react"

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Select, TextField } from "@mui/material"
import { sendMultipleNotification } from "src/public/hooks/notification"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import useUserData from "context/userData"
import MuiTextField from "src/public/mui/MuiTextField"

const AlarmDialog = ({isDialogOpen, setIsDialogOpen, checkedList, showCodeInput}) => {
  const {team} = useData()
  const {userData}= useUserData()

  const [alertInput, setAlertInput]= useState({
    title: "",
    subtitle:"",
    text:"",
    code:"",
    storyCode:"",
    buttonText:"",
    buttonUrl: "",
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
    else if(alertInput.buttonText!==""&&(alertInput.buttonUrl===""||!alertInput.buttonUrl.includes("http"))) alert("https://를 포함해 url을 입력해주세요.")
    else if(alertInput.buttonUrl!=="" && alertInput.buttonText==="") alert("버튼 명을 작성해주세요.")
    else{
      if(alertInput.code!==""){
        let type = ""
        const programDoc = await db.collection("team").doc(team.id).collection("programs").doc(alertInput.code).get()
          if(programDoc.exists) type = "program"
          else{
            const surveyDoc = await db.collection("team").doc(team.id).collection("surveys").doc(alertInput.code).get()
            if(surveyDoc.exists) type = "survey"
            else{
              const storyDoc = await db.collection("team").doc(team.id).collection("story").doc(alertInput.code).get()
              if(storyDoc.exists) type="story"
            }
          }
        
        if(type==="") alert("해당 게시물을 찾을 수 없습니다. 복사한 코드가 맞는지 확인해주세요.")
        else{
          const batch = db.batch()

          checkedList.map((uid) => {
            batch.set(db.collection("user").doc(uid).collection("alarm").doc(), {
              createdAt: new Date(),
              mode: "programAlarmWithUrl",
              docId: alertInput.code,
              docType: type,
              read: false,
              text: alertInput.text,
              title: alertInput.title,
              button: {url: alertInput.buttonUrl, text: alertInput.buttonText}
            })
          })
          
          try{

            if(type==="story"){
              const result = await sendMultipleNotification(checkedList, alertInput.title, alertInput.subtitle,
                'alarm_program',{url:`exp://192.168.219.103:19000/--/story/${team.id}/${alertInput.code}`}, team.teamId, userData.name)
            }else {
              // const result = await sendMultipleNotification(checkedList, alertInput.title, alertInput.subtitle,
              //   'alarm_program',{url:`com.zzsoft.thehanda://post/${team.id}/${alertInput.code}/${type}`}, team.teamId, userData.name)
            }
            // await batch.commit()
          }catch(e){
            console.log(e)
          }
          
        }
      } else {
        const batch = db.batch()

        const randomDoc = await db.collection("user").doc().get()

        checkedList.map((uid) => {
          batch.set(db.collection("user").doc(uid).collection("alarm").doc(randomDoc.id), {
            createdAt: new Date(),
            mode: "programAlarm",
            read: false,
            text: alertInput.text,
            title: alertInput.title,
          })
        })
        await batch.commit()

        const result = await sendMultipleNotification(checkedList, alertInput.title, alertInput.subtitle, 'alarm_program',{url: `com.zzsoft.thehanda://alarm/${randomDoc.id}`}, team.teamId, userData.name)

        console.log(result)
      }
        
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
          label="제목*"
          fullWidth
          variant="standard"
          value={alertInput.title}
          onChange={(e) => handleAlertInput(e, "title")}
        />
        <TextField
          
          margin="dense"
          label="부제목*"
          fullWidth
          variant="standard"
          value={alertInput.subtitle}
          onChange={(e) => handleAlertInput(e, "subtitle")}
        />
        <TextField
          
          margin="dense"
          label="내용"
          multiline
          maxRows={6}
          fullWidth
          variant="standard"
          value={alertInput.text}
          onChange={(e) => handleAlertInput(e, "text")}
        />
        {showCodeInput &&
          <TextField
            margin="dense"
            label="프로그램 코드"
            helperText={`코드를 작성 후, 유저가 알림에 버튼을 누르면 해당 게시물로 이동됩니다.\n게시물 관리의 "코드 복사" 기능을 활용해 원하는 프로그램의 코드를 복사하세요.`}
            multiline
            maxRows={6}
            fullWidth
            variant="standard"
            value={alertInput.code}
            onChange={(e) => handleAlertInput(e, "code")}
          />
        }
        {showCodeInput &&
          <TextField
            margin="dense"
            label="스토리 코드"
            helperText={`코드를 작성 후, 유저가 알림에 버튼을 누르면 해당 스토리로 이동됩니다.\n게시물 관리의 "코드 복사" 기능을 활용해 원하는 스토리의 코드를 복사하세요.`}
            multiline
            maxRows={6}
            fullWidth
            variant="standard"
            value={alertInput.storyCode}
            onChange={(e) => handleAlertInput(e, "storyCode")}
          />
        }
        <p style={{marginTop:"20px"}}>링크 버튼 생성</p>
        <Grid container columnSpacing={1}>
          <Grid item xs={6}>
            <MuiTextField dense fullWidth
              label="버튼 명"
              value={alertInput.buttonText}
              setValue={(val)=>setAlertInput(prev=>({...prev, buttonText: val}))}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiTextField dense fullWidth
                label="링크 (https:// 가 포함된 전체 주소)"
                value={alertInput.buttonUrl}
                setValue={(val)=>setAlertInput(prev=>({...prev, buttonUrl: val}))}

              />
          </Grid>
        </Grid>
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