import { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"
import { TextField, Button } from "@mui/material"
import { Router } from "mdi-material-ui"
import { useRouter } from "next/router"

const AddTeam = () => {
  const router = useRouter()
  //*****for inputs
  const [values, setValues] = useState({
    teamId: "",
    teamName:"",

  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }))
  }
  //for inputs*****

  const onButtonClick = async () => {
    const is_team_exists = async() => {
      const doc = await db.collection("team").doc(values.teamId).get()
      return doc.exists
    }

    if(values.teamId && values.teamName) {
      const res = await is_team_exists()
      if(res)
        alert("이미 있는 팀 ID입니다.")
      else{
        await db.collection("team").doc(values.teamId).set({
          ...values,
          profile: "https://firebasestorage.googleapis.com/v0/b/thehanda-72f78.appspot.com/o/default%2Flogo.png?alt=media&token=09de5a4f-4087-4fdb-9511-25739612581d"
        })
        await db.collection("team_admin").doc(values.teamId).collection("points").doc("data").set({
          remainPoint: 0
        })
        alert("성공적으로 생성되었습니다.")
      }
    }

  }

  return(
    <div style={{padding: "30px 40px"}}>
      <TextField
        label="팀 ID"
        variant="standard"
        value={values.teamId}
        onChange={onValuesChange("teamId")}
        size="small"
        fullWidth
      />
      <TextField
        label="팀명"
        variant="standard"
        value={values.teamName}
        onChange={onValuesChange("teamName")}
        size="small"
        fullWidth
      />
      <Button
        variant="contained"
        onClick={onButtonClick}
        sx={{mt:"20px"}}
        fullWidth
      >
        팀 생성
      </Button>
      <Button
        variant="contained"
        onClick={()=>router.back()}
        sx={{mt:"20px"}}

      >
        {`< 뒤로가기`}
      </Button>
    </div>
  )
}

export default AddTeam