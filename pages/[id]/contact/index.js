import { useEffect, useState } from "react";
import styles from "src/contact/contact.module.css"
import useData from "context/data";
import useUserData from "context/userData";
import { firestore as db } from "firebase/firebase";

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import DeviceUnknownOutlinedIcon from '@mui/icons-material/DeviceUnknownOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { sendNotification } from "src/public/hooks/notification";
const Contact = () => {
  const [selectedMenu, setSelectedMenu] = useState("all")
  const {team} = useData()
  const {userData} = useUserData()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [sortedData, setSortedData] = useState([])
  const [openContent, setOpenContent] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [repliedText, setRepliedText] = useState("")

  const [hasUserReadTheMessage, setHasUserReadTheMessage] = useState(null)

  useEffect(()=>{
    console.log(selectedIndex)
    if(openContent)
      setRepliedText(sortedData[selectedIndex]?.repliedText || "")
  },[selectedIndex,openContent])

  useEffect(()=>{
    // db.collection("team_admin").doc("suwon").
    //권한에 따른 데이터 받기
    const fetchData = async () => {
      let query
      console.log(team)
      if(userData.roles.includes("super_admin")||userData.roles.includes(`${team.id}_super_admin`)){
        query = await db.collection("team_admin").doc(team.id).collection("contact").orderBy("createdAt", 'desc').get()
      } else {
        query = await db.collection("team_admin").doc(team.id).collection("contact").where('show', '==', true).orderBy("createdAt", 'desc').get()
      }
      console.log(query.docs)
      const temp = await Promise.all(query.docs.map(async (doc) => {
        const userDoc = await db.collection("user").doc(doc.data().uid).get();
        if (userDoc.exists) {
          return {
            ...doc.data(),
            id: doc.id,
            displayName: userDoc.data().basicProfile?.displayName,
            realName: userDoc.data().basicProfile?.realName,
            photoUrl: userDoc.data().photoUrl || "", 
          };
        } else 
          return{id: 'undefined'}
      }).filter(Boolean))
      console.log(temp)
      const filteredTemp = temp.filter((obj) => obj.id !== 'undefined' )
      setData(filteredTemp)
      console.log(filteredTemp)
      setSortedData(filteredTemp)
      setIsLoading(false)
    }

    fetchData()
  },[])

  useEffect(()=>{
    if (selectedMenu === "all") {
      setSortedData(data);
    } else {
      const temp = data.filter(item => {
        if (selectedMenu === "program") {
          return item.mode === "program";
        } else if (selectedMenu === "unreply") {
          return !item.reply;
        } else if (selectedMenu === "reply") {
          return item.reply;
        }
      });
      setSortedData(temp);
    }
    
  },[selectedMenu,data])

  const onMenuClick = (menu) => {
    setSelectedMenu(menu)
    setOpenContent(false)
  }

  const onItemClick = async (index) => {
    setHasUserReadTheMessage(null)
    setOpenContent(true)
    setSelectedIndex(index)

    //해당 유저가 문의를 읽었는지 유무
    const alarmSnapshot = await db.collection("user").doc(sortedData[index].uid).collection("alarm").where("id","==",sortedData[index].id).orderBy("createdAt",'desc').limit(1).get()
    if(!alarmSnapshot.empty){
      const alarmDoc = alarmSnapshot.docs[0]
      if(alarmDoc.data().read) setHasUserReadTheMessage(true)
      else setHasUserReadTheMessage(false)
    }

    console.log(sortedData[index])
  }

  const onDeleteClick = () => {
    if (confirm("정말로 삭제하시겠습니까? 이 문의를 보낸 사용자는 이 문의에 대한 답변을 들을 수 없습니다.")) {
      const idToDelete = sortedData[selectedIndex].id;
      db.collection("team_admin").doc(team.id).collection("contact").doc(idToDelete).delete()
        .then(() => {
          setData(prevData => prevData.filter(item => item.id !== idToDelete));
          setOpenContent(false);
        })
    }
  };  
  
  const onShowClick = () => {
    const idToShow = sortedData[selectedIndex].id
    db.collection("team_admin").doc(team.id).collection("contact").doc(idToShow).update({
      show: true
    }).then(()=>{
      setData(prevData => prevData.map((item) =>{
        if(item.id===idToShow)
          return {...item, show: true}
        else
          return item
      }))
        alert("모든 관리자에게 공개되었습니다.")
    })
  }
  const onHideClick = () => {
    const idToShow = sortedData[selectedIndex].id
    db.collection("team_admin").doc(team.id).collection("contact").doc(idToShow).update({
      show: false
    }).then(()=>{
      setData(prevData => prevData.map((item) =>{
        if(item.id===idToShow)
          return {...item, show: false}
        else
          return item
      }))
        alert("super 등급 관리자에게만 공개됩니다.")
    })
  }
  
  const onSendClick = async () => {
    const {id, uid } = sortedData[selectedIndex]
    if(confirm("답장을 보내시겠습니까?")){
      const randomDoc = await db.collection("user").doc().get()
      const batch = db.batch()
      batch.update(db.collection("team_admin").doc(team.id).collection("contact").doc(id), {reply: true, repliedText: repliedText })
      batch.set(db.collection("user").doc(uid).collection("alarm").doc(randomDoc.id),{
        ...data[selectedIndex], repliedText: repliedText, createdAt: new Date(),read: false,
      })
      batch.commit().then(async()=>{
        setData(prevData => prevData.map((item)=>{
          if(item.id === id)
            return {...item, reply: true, repliedText: repliedText}
          else
            return item
        }))
        setOpenContent(false)
        db.collection("user").doc(uid).get().then(async(doc) => {
          try {
            // const result = await sendNotification(uid,"문의답장 알림","문의하신 내용에 답장이 도착했습니다.", "Chat", 'alarm_message', {screen:"Main", params: {mode:"alarm"}});
            const result = await sendNotification(uid,"문의답장 알림","문의하신 내용에 답장이 도착했습니다.", 'alarm_message', {url:`com.zzsoft.thehanda://alarm/${randomDoc.id}`});
            setRepliedText("")
            alert("성공적으로 보냈습니다.")
          } catch (e) {
            console.log(e);
          }
        })
      })
    }
  }
  const onResendClick = async () => {
    const {id, uid } = sortedData[selectedIndex]
    if(confirm("답장을 재전송하시겠습니까?")){
      const randomDoc = await db.collection("user").doc().get()
      const batch = db.batch()
      batch.update(db.collection("team_admin").doc(team.id).collection("contact").doc(id), {reply: true, repliedText: repliedText })
      batch.set(db.collection("user").doc(uid).collection("alarm").doc(randomDoc.id),{
        ...data[selectedIndex], repliedText: repliedText, createdAt: new Date(),read: false, title: `${data[selectedIndex].title}(재전송)`
      })
      batch.commit().then(async()=>{
        setData(prevData => prevData.map((item)=>{
          if(item.id === id)
            return {...item, reply: true, repliedText: repliedText}
          else
            return item
        }))
        setOpenContent(false)
        // db.collection("user").doc(uid).get().then(async(doc) => {
          try {
            const result = await sendNotification(uid,"문의답장 알림","문의하신 내용에 답장이 도착했습니다.", 'alarm_message', {url:`com.zzsoft.thehanda://alarm/${randomDoc.id}`});
            if(result.title==="전송 성공"){
              setRepliedText("")
              alert("성공적으로 보냈습니다.")
            }
          } catch (e) {
            console.log(e);
          }
        // })
      })
    }
  }

  return(
    <div className={styles.main_container}>
      <ul className={styles.left_container}>
        <li className={selectedMenu==="all" && styles.selected} onClick={()=>onMenuClick("all")}><MailOutlineRoundedIcon /><p>전체</p></li>
        <li className={selectedMenu==="program" && styles.selected} onClick={()=>onMenuClick("program")}><DeviceUnknownOutlinedIcon /><p>프로그램 문의</p></li>
        {/* <li className={selectedMenu==="unread" && styles.selected} onClick={()=>setSelectedMenu("unread")}><MarkEmailUnreadOutlinedIcon /><p>읽지 않은 문의</p></li> */}
        <li className={selectedMenu==="unreply" && styles.selected} onClick={()=>onMenuClick("unreply")}><FeedbackOutlinedIcon /><p>미회신 문의</p></li>
        <li className={selectedMenu==="reply" && styles.selected} onClick={()=>onMenuClick("reply")}><SendOutlinedIcon /><p>회신 완료한 문의</p></li>
      </ul>
      <ul className={styles.right_container}>
        {isLoading ? 
          <div className={styles.loader}>
            <CircularProgress size={30}/>
          </div>
          :
          <>
          {
             sortedData.map((item, index) => {
              if(item)
              return(
                <li key={index} onClick={()=>{if(item.displayName) onItemClick(index)}}>
                  <div className={styles.item_left}>
                    <Avatar alt={item.displayName} src={item.photoUrl} sx={{width: 31, height: 31}}/>
                    <h1>{item.displayName ?? "삭제된 유저"}</h1>
                    <p>{item.mode==="program" && "[프로그램 문의]"}{item.title}</p>
                  </div>

                  <div className={styles.item_right}>
                    {item.show ? <p>모두 공개</p> : <p>비공개</p>}
                    <p>{item.createdAt.toDate().toLocaleString('ko-KR').replace(/\s/g, '') }</p>
                  </div>
                </li>
              )
            })
          }
            <div className={openContent ? `${styles.content_container} ${styles.show}` : styles.content_container}>
              <div className={styles.content_header} onClick={() => {setOpenContent(false);setRepliedText("");}}>
                <ArrowBackIosNewRoundedIcon style={{fontSize:"20px"}}/>
                <p>{sortedData[selectedIndex]?.mode==="program" && "[프로그램 문의]"}{sortedData[selectedIndex]?.title}</p>
              </div>
              <div className={styles.control}>
                {sortedData[selectedIndex]?.show ? <p>상태: 모두 공개</p> : <p>상태: 비공개</p>}

                {userData.roles.includes("super_admin")||userData.roles.includes(`${team.id}_super_admin`) &&
                  (!sortedData[selectedIndex]?.show ? 
                    <Tooltip title="모두 공개">
                      <IconButton onClick={onShowClick}>
                        <VisibilityOffOutlinedIcon style={{fontSize:"20px", cursor:"pointer"}} />
                      </IconButton>
                    </Tooltip>
                    :
                    <Tooltip title="비공개">
                      <IconButton onClick={onHideClick}>
                        <VisibilityOutlinedIcon style={{fontSize:"20px", cursor:"pointer"}} />
                      </IconButton>
                    </Tooltip>
                  )
                }
                {userData.roles.includes("super_admin")||userData.roles.includes(`${team.id}_super_admin`) &&
                  <Tooltip title="삭제">
                    <IconButton onClick={onDeleteClick}>
                      <DeleteOutlineRoundedIcon style={{fontSize:"20px", cursor:"pointer"}} />
                    </IconButton>
                  </Tooltip>
                }
              </div>
              <div className={styles.body_container}>
                <div className={styles.content}>

                  <div className={styles.user_info}>
                    <div className={styles.item_left}>
                      <Avatar alt={sortedData[selectedIndex]?.displayName} src={sortedData[selectedIndex]?.photoUrl} sx={{width: 31, height: 31}}/>
                      <h1>{`${sortedData[selectedIndex]?.displayName}   |   ${sortedData[selectedIndex]?.realName}`}</h1>
                    </div>

                    <div className={styles.item_right}>
                      <p>{sortedData[selectedIndex]?.createdAt.toDate().toLocaleString('ko-KR').replace(/\s/g, '') }</p>
                    </div>
                  </div>

                  <p className={styles.text}>
                    {sortedData[selectedIndex]?.text}
                  </p>
                </div>
                
                {sortedData[selectedIndex]?.reply ? 
                  <div className={styles.content} style={{marginTop: "25px"}}>
                    답장 전송됨 | {hasUserReadTheMessage ? `사용자가 읽음` : '사용자가 아직 읽지않음'}
                    <TextField multiline fullWidth maxRows={12} style={{marginTop:"15px", marginBottom:"10px"}} 
                      value={repliedText}
                      onChange= {(e)=>setRepliedText(e.target.value)}
                      size='small'
                    />
                    <div style={{display:"flex", justifyContent:"flex-end"}}>
                      <Button variant="contained" size="small" style={{display:"flex", alignItems: "center"}} onClick={onResendClick}>재전송 <SendIcon style={{fontSize:"14px", marginLeft:"10px"}}/></Button>
                    </div>
                  </div>
                :
                  <div className={styles.content} style={{marginTop: "25px"}}>
                    답장 보내기 : 
                    <TextField multiline fullWidth maxRows={12} style={{marginTop:"15px", marginBottom:"10px"}} 
                      value={repliedText}
                      onChange= {(e)=>setRepliedText(e.target.value)}
                      size="small"
                    />
                    <div style={{display:"flex", justifyContent:"flex-end"}}>
                      <Button variant="contained" size="small" style={{display:"flex", alignItems: "center"}} onClick={onSendClick}>보내기 <SendIcon style={{fontSize:"14px", marginLeft:"10px"}}/></Button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </>
        }
      </ul>
    </div>
  )
}

export default Contact