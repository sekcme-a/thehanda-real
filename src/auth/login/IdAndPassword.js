import styles from "./idAndPassword.module.css"
import { useState, useEffect } from "react"
import { auth } from "firebase/firebase"
import useUserData from "context/userData"
import { useRouter } from "next/router"

import { Button, IconButton, TextField } from "@mui/material"
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { FUNCTION } from "./IdAndPasswordFunction"

const IdAndPassword = ({style={}}) => {
  const router = useRouter()
  const {user, setUser} = useUserData()
  const [isPwVisible, setIsPwVisible] = useState(false)
  //*****for inputs
  const [values, setValues] = useState({
    email: "",
    pw:"",
  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  //for inputs*****

  useEffect(()=>{
    setError({type:"", message:""})
  },[values])

  const onLoginClick = async () => {
    if(!values.email) setError({type:"email", message:'이메일을 입력해주세요.'})
    else if(!values.pw) setError({type:"pw", message:"비밀번호를 입력해주세요."})
    else{
      let userCred
      try{
        userCred = await auth.signInWithEmailAndPassword(values.email, values.pw)
        setUser(userCred.user ?? null)
      } catch(e){
        const message = FUNCTION.get_error_message(e.message)
        setError(message)
      }
    }
  }

  const onKeyDown = (e) => {
    if(e.key==="Enter")
      onLoginClick()
  }

  return(
    <div className={styles.main_container} style={style}>
      <TextField
        label="이메일"
        variant="outlined"
        error={error.type==="email"}
        helperText={error.type!=="email" ? "" : error.message}
        value={values.email}
        onChange={onValuesChange("email")}
        fullWidth
        size="small"
      />
      
      <TextField
        label="비밀번호"
        variant="outlined"
        sx={{mt:"20px"}}
        type={isPwVisible ? "text":"password"}
        error={error.type==="pw"}
        helperText={error.type!=="pw" ? "" : error.message}
        value={values.pw}
        onChange={onValuesChange("pw")}
        onKeyDown={onKeyDown}
        // multiline={false} rows={1} maxRows={1}
        size="small"
        InputProps={{
          endAdornment: <IconButton onClick={()=>setIsPwVisible(!isPwVisible)}>{isPwVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}</IconButton>
        }}
        fullWidth
      />

      <Button variant="text" sx={{mt:'10px'}} onClick={()=>router.push("/auth/resetPassword")}>비밀번호를 잊으셨나요?</Button>

      <Button fullWidth variant="contained" onClick={onLoginClick} sx={{mt:"20px"}}>로그인</Button>
      <Button fullWidth variant="contained" sx={{mt:"15px"}} color="secondary" onClick={()=>router.push("/auth/signIn")}>회원가입</Button>
    </div>
  )
}

export default IdAndPassword