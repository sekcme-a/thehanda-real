import { useState, useEffect } from "react";
import { firestore as db } from "firebase/firebase";
import { TextField } from "@mui/material";
import styles from "./Memo.module.css"
import useData from "context/data";
import { Button } from "@mui/material";
import useUserData from "context/userData";
// import UndoIcon from '@mui/icons-material/Undo';
// import RedoIcon from '@mui/icons-material/Redo';

const Memo = ({data}) => {
  const [history, setHistory] = useState(0)
  const [text, setText] = useState("")
  const {user, userData} = useUserData()
  const {team} = useData()

  const [memoList, setMemoList] = useState([])

  useEffect(()=> {
    const fetchData = async () => {
      //혹시 모르니까 최근 8개 메모는 기록해놓는다.
      const querySnapshot = await db.collection("team_admin").doc(team.teamId).collection("users").doc(data.uid).collection("memo").orderBy("createdAt","desc").limit(8).get()
      if(!querySnapshot.empty){
        const list = querySnapshot.docs.map((doc) => {
          return({id: doc.id, ...doc.data()})
        })
        setMemoList(list)
        console.log(typeof list[0].createdAt ==="object")
        setText(list[0].text)
      }
    }

    fetchData()
  },[])

  const onSubmitClick = async  () => {
    if(!confirm("메모를 저장하시겠습니까?")) return;

    //메모 작성중에 다른 사람이 갱신작성한 내용이 있으면 새로고침후 다시시도 문구
    const recentDocQuery = await db.collection("team_admin").doc(team.teamId).collection("users").doc(data.uid).collection("memo").orderBy("createdAt","desc").limit(1).get()
    if(!recentDocQuery.empty){
      // const recentDoc = recentDocQuery.docs
      // console.log(recentDocQuery.docs[0].data().createdAt.toMillis())
      // console.log(memoList[0].createdAt.toMillis())
      let recent = recentDocQuery.docs[0].data().createdAt.toMillis()
      let my = memoList[0].createdAt
      // if(recent.seconds) recent = recent.toMillis()
      // else recent = recent.toDate().toMillis()
      console.log(recent)
      console.log(new Date(my).getTime())
      if(my.seconds) my = my.toMillis()
      else my = new Date(my).getTime()
      
      if(recent>my){
        alert("메모 작성중에 다른 이용자가 메모를 갱신해서 저장할 수 없습니다. 새로고침 후 다시 시도해주세요.")
        return;
      }
    }


    const batch = db.batch()
    batch.set(db.collection("team_admin").doc(team.teamId).collection("users").doc(data.uid).collection("memo").doc(),{
      createdAt: new Date(),
      uid: user.uid,
      text: text,
      author: userData.name,
    })

    //최근 8개 메모만 기억할껀데 만약 그 이상의 메모 기록이 있다면 가장 오래된 메모기록 삭제
    console.log(memoList)
    if(memoList.length>=8 && memoList[7].id){
      batch.delete(db.collection("team_admin").doc(team.teamId).collection("users").doc(data.uid).collection("memo").doc(memoList[7].id))
    }
    try{
      await batch.commit()
      setMemoList(prevMemoList => ([
        {      createdAt: new Date(),
          uid: user.uid,
          text: text,
          author: userData.name,
        },
        ...prevMemoList
      ]))
      alert("성공적으로 저장되었습니다.")
    }catch(e){
      console.log(e)
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.")
    }

  }

  return(
    <div className={styles.memo_container}>
      <h1>유저 메모를 자유롭게 입력하세요.</h1>
      <p>해당 내용은 같은 팀 내 모든 관리자와 공유됩니다.</p>
      {memoList.length!==0 &&
        memoList[0].createdAt.seconds
        ?
          <p style={{fontSize:"12px", marginBottom:"20px"}}>최근 저장일: {memoList[0]?.createdAt?.toDate()?.toLocaleString("ko-kr")} | {memoList[0]?.author}</p>
          :
          <p style={{fontSize:"12px", marginBottom:"20px"}}>최근 저장일: {memoList[0]?.createdAt?.toLocaleString("ko-kr")}</p>
      }
      {/* <Button size="small"><UndoIcon /></Button> */}
      <TextField          
        label="유저 메모"
        multiline
        fullWidth
        rows={4}
        value={text}
        placeholder="유저 메모를 입력하세요!"
        onChange={(e)=>setText(e.target.value)}
      />
      <div className={styles.button_container}>
        {/* <Button size="small" style={{marginRight:"30px"}} onClick={onHistoryClick}>저장기록</Button> */}
        <Button variant="contained" size="small" onClick={onSubmitClick}>저장</Button>
      </div>
    </div>
  )
}
export default Memo