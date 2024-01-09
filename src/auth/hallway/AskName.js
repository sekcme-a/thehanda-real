import { useEffect, useState } from "react";
import useUserData from "context/userData"
import { TextField, Button } from "@mui/material";
import { firestore as db } from "firebase/firebase";

const AskName = ({setStep}) => {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const {user, userData, setUserData} = useUserData()

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    console.log(user)
  },[])

  const onButtonClick = async() => {
    if(name.length<2)
      setError("최소 2글자 이상이여야 합니다.")
    else{
      setIsSubmitting(true)
      await db.collection("user").doc(user.uid).update({
        name: name,
        phoneNumber: phoneNumber,
      })
      setUserData({...userData, name: name, phoneNumber: phoneNumber})
      setStep(2)
    }
  }

  const onKeyDown = (e) => {
    if(e.key==="Enter")
      onButtonClick()
  }
  
  return(
    <>
      <TextField
        label="이름을 입력해주세요."
        variant="standard"
        error={error!==""}
        helperText={error==="" ? "" : error}
        value={name}
        onChange={(e) => {setName(e.target.value); setError("")}}
        // multiline={false} rows={1} maxRows={1}
        size="small"
        sx={{mr:"40px"}}
      />

      <TextField
        label="전화번호를 입력해주세요."
        variant="standard"
        value={phoneNumber}
        onChange={(e) => {setPhoneNumber(e.target.value)}}
        // multiline={false} rows={1} maxRows={1}
        onKeyDown={onKeyDown}
        size="small"
      />
      <Button
        variant="contained"
        onClick={onButtonClick}
        sx={{ml:"20px"}}
        disabled={isSubmitting}
      >
        {isSubmitting ? "제출 중":"확인"}
      </Button>
    </>
  )
}

export default AskName