import { useState, useEffect, useRef,  } from "react";
import useData from "context/data";
import { firestore as db } from "firebase/firebase";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import styles from "./ChatView.module.css"
import Image from "next/image";
import { sendNotification } from "src/public/hooks/notification";
import { CircularProgress } from "@mui/material";

const ChatView = ({uid, userName}) =>{
  const [dates, setDates] = useState([])
  const [input, setInput] = useState("")
  // const {teamProfile, teamName} = useData()
  const {team} = useData()
  const [isShiftPress, setIsShiftPress] = useState(false)
  const messagesRef = useRef(null);
  const [isSending, setIsSending] = useState(false)
  useEffect(()=>{
    // setDates([
    //   {
    //     chat:[
    //       {text:"recen2t", type:"center", createdAt:"08:30"},
    //       {text:"previous2", type:"center", createdAt:"08:24"},
    //     ],
    //     date: new Date(),
    //     timeline: "2023.04.04"
    //   },
    // ])
    const dbRef = db.collection("user").doc(uid).collection("chat").doc(team.teamId).collection("date").orderBy("date", "desc").limit(12)
    
    const unsubscribe = dbRef.onSnapshot((querySnapshot) => {
      if(!querySnapshot.empty){
        const data = querySnapshot.docs.map((doc)=>{
          return({
            ...doc.data(),
            chat: doc.data().chat.reverse(),
            timeline: doc.id
          })
        })
        // setDates([...data,])
        setDates([...data.reverse()])

        // db.collection("team").doc(team.teamId).collection("chat_thumbnail").doc(uid).update({
        //   unread: 0
        // })

        setTimeout(()=>{
          const element = messagesRef.current;
          element.scrollTop = element.scrollHeight;
        },100)

      } else {
        setDates([])
      }
    })
    

    return () => {
      unsubscribe()
    }
  },[uid])

  const getYYYYMM = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed, so we add 1
    const day = today.getDate();

    const formattedDate = `${year}.${month.toString().padStart(2, '0')}`;
    return formattedDate
  }

  const getHHMM = () => {
    const now = new Date();
    let hours = now.getHours();
    console.log(hours)
    const amOrPm = hours >= 12 ? 'pm' : 'am'; // 오전/오후 구분
    hours = hours % 12 || 12; // 12시간제로 변환
    const minutes = now.getMinutes().toString().padStart(2, '0'); // 분을 가져와서 두 자리로 맞추고 앞에 0을 채움
    const time = `${amOrPm} ${hours}:${minutes}`; // 시간과 분을 결합하여 am/pm HH:MM 형태의 문자열 생성
    return time; // 예시 출력: "pm 03:30"
  }

  const onSubmit = async () => {
    const batch = db.batch()
    const YYYYMM = getYYYYMM()
    const HHMM = getHHMM()
    setIsSending(true)
    if(input.length>1000){
      alert("1000글자 이내이야 합니다.")
      return;
    }
    if(isSending)
      return

    //삭제된 사용자라면 alert뜨고 안보내지게
    const userDoc = await db.collection("user").doc(uid).get()
    if(!userDoc.exists){
      alert("삭제되거나 없는 사용자입니다.")
      setIsSending(false)
      return
    }
    
    if(dates[0]===undefined){
      batch.set(db.collection("user").doc(uid).collection("chat").doc(team.teamId).collection("date").doc(YYYYMM), {
        date: new Date(),
        chat: [{text:input, type:"center", createdAt: new Date(), _id: new Date().getTime()}]
      })
    }
    else{
      //만약 같은 날짜가 아니라면 = 최근 톡 날짜 이후의 날짜가 된다면
      console.log(YYYYMM)
      console.log(dates[dates.length-1].timeline)
      if(YYYYMM!==dates[dates.length-1]?.timeline){
        batch.set(db.collection("user").doc(uid).collection("chat").doc(team.teamId).collection("date").doc(YYYYMM), {
          date: new Date(),
          chat: [{text:input, type:"center", createdAt: new Date(), _id: new Date().getTime()}]
        })
      } else{
        batch.set(db.collection("user").doc(uid).collection("chat").doc(team.teamId).collection("date").doc(YYYYMM), {
          date: new Date(),
          chat: [{text:input, type:"center", createdAt: new Date(), _id: new Date().getTime()},...dates[dates.length-1].chat.reverse(),]
        })
      }
    }


    //읽지 않음 count
    // const messageDoc = await db.collection("user").doc(uid).collection("chat_thumbnail").doc("status").get()
    // if(messageDoc.exists){
    //   if(messageDoc.data().unread)
    //     batch.update(db.collection("user").doc(uid).collection("chat_thumbnail").doc("status"), {unread: messageDoc.data().unread+1})
    //   else
    //     batch.update(db.collection("user").doc(uid).collection("chat_thumbnail").doc("status"), {unread: 1})
    // } else {
    //   batch.set(db.collection("user").doc(uid).collection("chat_thumbnail").doc("status"), {unread: 1})
    // }

    // const doc = await db.collection("user").doc(uid).collection("chat_thumbnail").doc(team.teamId).get()
    // if(doc.exists){
    //   batch.set(db.collection("user").doc(uid).collection("chat_thumbnail").doc(team.teamId),{
    //     repliedAt: new Date(),
    //     mode:"talk",
    //     title: teamName,
    //     content: input,
    //     unread: doc.data().unread+1,
    //     teamProfile: teamProfile
    //   })
    // } else{
    //   batch.set(db.collection("user").doc(uid).collection("chat_thumbnail").doc(team.teamId),{
    //     repliedAt: new Date(),
    //     mode:"talk",
    //     title: teamName,
    //     content: input,
    //     unread: 1,
    //     teamProfile: teamProfile
    //   })
    // }

    //admin쪽 messagelist변경위해
    batch.set(db.collection("team").doc(team.teamId).collection("chat_thumbnail").doc(uid), {
      createdAt: new Date(),
      displayName: userName,
      content: input,
      unread: false,
    })
    
    //user쪽 메세지 썸네일 보내기
    batch.set(db.collection("user").doc(uid).collection("chat").doc(team.teamId),{
      content: input,
      createdAt: new Date(),
      unread: true
    })


    batch.commit().then( async()=>{
      //push notification
      try{

        const result = await sendNotification(uid,team.teamName,input, 'alarm_message');  
        setIsSending(false)
        setInput("")
      }catch(e){
        setInput("")
        setIsSending(false)
        console.log(e)
        console.log(e.message)
      }
    })



  }

  const handleOnKeyPress = (e) => {
    console.log(e.key)
    let shiftPress = isShiftPress
    if (e.key==="Shift"){
      setIsShiftPress(true)
      shiftPress=true
    }

    if (e.key === "Enter" && !shiftPress) {
      onSubmit()
    }
  }
  const handleKeyUp = (e) => {
    if(e.key==="Shift")
      setIsShiftPress(false)
  }


  return(
    <div className={styles.main_container}>
      <div className={styles.chat_container} ref={messagesRef}>
        {dates.length===0 && <p className={styles.no_chat}>아직 채팅 내역이 없거나 삭제된 유저입니다.</p>}
        {dates.map((date)=>{
          return(
            <ul key={date.timeline}>
              <h1>{date.timeline}</h1>

              
                {date?.chat?.map((chat, index)=>{
                  if(chat.type==="center")
                    return(
                      <div className={`${styles.text_container} ${styles.my_text}`}>
                        <p>{chat?.createdAt?.toDate()?.toLocaleString().replace(/:\d{2}\s*/, '').substring(2)}</p>
                        <li key={index}>
                          <h4>{chat.text}</h4>
                        </li>
                      </div>
                    )
                  else
                    return(
                      <div className={`${styles.text_container} ${styles.other_text}`}>
                        
                        <li key={index}>
                          <h4>{chat.text}</h4>
                        </li>
                        <p>{chat?.createdAt?.toDate()?.toLocaleString().replace(/:\d{2}\s*/, '').substring(2)}</p>
                      </div>
                    )
                })}
             
            </ul>
          )
        })}
      </div>

      <div className={styles.input_container}>
        <TextField sx={{minHeight:"20px"}} multiline
          value={input} onChange={e=>{setInput(e.target.value)}}
          fullWidth size="small" maxRows={4}
          onKeyDown={handleOnKeyPress}
          onKeyUp={handleKeyUp}
          disabled={isSending}
          />
        <Button variant="contained" sx={{ minWidth:"40px", ml:"10px"}} onClick={onSubmit}>
          {isSending ?
            <CircularProgress size={20} sx={{color:"white"}}/>
          : 
            <ArrowUpwardOutlinedIcon sx={{fontSize:"20px"}}/>
          }
        </Button>
      </div>
    </div>
  )
}

export default ChatView