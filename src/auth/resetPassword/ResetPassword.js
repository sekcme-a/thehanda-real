import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from "./ResetPassword.module.css"

import { Button, TextField } from "@mui/material"
import { auth } from "firebase/firebase"


const ResetPassword = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSuccessfullySent, setIsSuccessfullySent] = useState(false)

  useEffect(()=>{
    setError("")
    setIsSuccessfullySent(false)
  },[email])


  const onSendEmailClick = async () => {
    if(!email)  setError("이메일을 입력해주세요.")
    else{
      setIsSending(true)
      try{
        await auth.sendPasswordResetEmail(email)
        setIsSending(false)
        setIsSuccessfullySent(true)
      } catch(e){
        if(e.message==="There is no user record corresponding to this identifier. The user may have been deleted."){
          setError("등록되지 않은 이메일입니다.")
          setIsSending(false)
        }
      }
    }



  }

  return(
    <>
      <TextField
        label="이메일 "
        variant="outlined"
        sx={{mt:"40px", mb:"40px"}}
        error={error!==""}
        helperText={error}
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        fullWidth
        size="small"
      />
      {isSuccessfullySent && <p className={styles.success}>비밀번호 재설정 이메일을 보냈습니다.<br /> 메일함을 확인해주세요.</p>}
      <Button
        variant="contained"
        fullWidth
        onClick={onSendEmailClick}
      >
        Send Reset Link
      </Button>
      
      <div className={styles.center}>
        <Button
          variant="text"
          onClick={()=>router.back()}
        >
          {"< 뒤로가기"}
        </Button>
      </div>
    </>
  )
}

export default ResetPassword