
import { Button, TextField } from "@mui/material"
import styles from "./GivePoint.module.css"

import { useState } from "react"

import { firestore as db } from "firebase/firebase"
import { EditPoint_ForSuperAdmin } from "src/public/hooks/handlePoints"

const GivePoint = () => {
  const [givePointAmount, setGivePointAmount] = useState("")
  const [teamId, setTeamId] = useState("")
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("더한다")
  const [reason, setReason] = useState("")

  const onGivePointAmountChange = (e) => {
    // const inputValue = e.target.value.replace(/[^0-9]/g, '');
    setGivePointAmount(e.target.value);
  }


  const onAddClick = async () => {
    if(confirm("포인트를 충전 혹은 제거 하시겠습니까?")){
      const numRegex = /^-?\d+$/;
      if (!numRegex.test(givePointAmount)) {
        alert("포인트는 숫자로 입력해주세요.")
        return 
      } else {
        try{
          await EditPoint_ForSuperAdmin(
            teamId, 
            title,
            author,
            givePointAmount,
            reason,
          )
        }
        catch(e){
          alert("포인트를 성공적으로 충전 혹은 제거했습니다.")
        }
      }
    }
  }

  return(
    <div className={styles.main_container}>
      <h1>임의 충전 혹은 제거</h1>
      <div className={styles.input_container}>
        <TextField
          label="충전할 팀 아이디"
          value={teamId}
          onChange={(e)=>setTeamId(e.target.value)}
          size="small"
          sx={{mr:"15px"}}
        />
        <TextField
          label="충전혹은 제거할 포인트"
          value={givePointAmount}
          onChange={onGivePointAmountChange}
          size="small"
          sx={{mr:"15px"}}
        />
        <TextField
          label="제목"
          helperText="해당 내용은 팀의 포인트 기록에 남겨집니다."
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          size="small"
          sx={{mr:"15px"}}
        />
        <TextField
          label="사용자"
          helperText="해당 내용은 팀의 포인트 기록에 남겨집니다."
          value={author}
          onChange={(e)=>setAuthor(e.target.value)}
          size="small"
          sx={{mr:"15px"}}
        />
        <TextField
          label="사유"
          helperText="해당 내용은 어플 관리자만 볼 수 있습니다."
          value={reason}
          onChange={(e)=>setReason(e.target.value)}
          size="small"
          sx={{mr:"15px"}}
        />
        <Button
          variant="contained"
          sx={{mr:"20px"}}
          onClick={()=>onAddClick()}
        >적용</Button>
      </div>
    </div>
  )
}

export default GivePoint