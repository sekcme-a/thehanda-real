import { Button, Grid, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import MuiButton from "src/public/mui/MuiButton"

import { firestore as db } from "firebase/firebase"

const UserViewOverview = ({data, setData}) => {

  const [value, setValue] = useState(data)
  const [additionalValue, setAdditionalValue] = useState({
    realName: "",
    phoneNumber:"",
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setValue(data)
    if(data.additionalProfile) setAdditionalValue(data.additionalProfile)
  },[data])

  const handleAdditionalProfile = (key, val) => {
    setAdditionalValue(prev => ({
      ...prev,
      [key]: val
    }))
  }

  const onSaveClick = async () => {
    setIsSaving(true)
    await db.collection("user").doc(data.uid).update({
      additionalProfile: additionalValue
    })
    setIsSaving(false)
    alert("성공적으로 저장했습니다.")
  }

  return (
    <div>
      {/* <p style={{fontSize:"15px", marginTop:"7px", marginBottom:"20px"}}>{`해당 유저의 프로필 정보를 수정하실 수 있습니다. (해당 유저의 어플에도 동일 적용됩니다)`}</p> */}
      <Grid container rowSpacing={2} columnSpacing={1}>
        <Grid tiem xs={12}>
          <h1 style={{margin:"5px 0 10px 10px"}}>
            프로그램 알림: <strong style={{color: value?.alarm_program ? "green" : "red"}}>{value?.alarm_program ? "ON" : "OFF"} </strong>
            | 채팅 알림: <strong style={{color: value?.alarm_message ? "green" : "red"}}>{value?.alarm_message ? "ON" : "OFF"} </strong>
            | 이벤트 알림:  <strong style={{color: value?.alarm_event ? "green" : "red"}}>{value?.alarm_event ? "ON" : "OFF"} </strong>
          </h1>
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value?.basicProfile?.realName}
            label="실명"
            size="small"
            // onChange={(e) => handleChange("realName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={additionalValue.realName}
            helperText="해당 내용은 수정하실 수 있습니다."
            label="실명(관리자 메모)"
            size="small"
            onChange={(e) => handleAdditionalProfile("realName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value?.basicProfile?.phoneNumber}
            label="전화번호"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={additionalValue.phoneNumber}
            label="전화번호(관리자 메모)"
            helperText="해당 내용은 수정하실 수 있습니다."
            size="small"
            onChange={(e) => handleAdditionalProfile("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value?.basicProfile?.displayName}
            label="닉네임"
            size="small"
            // onChange={(e) => handleChange("displayName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={`${value?.basicProfile?.country?.flag} ${value?.basicProfile?.country?.text}`}
            label="국적"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value.basicProfile.gender==="male" ? "남" : value.basicProfile.gender==="female" ? "여" : "기타"}
            label="성별"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={data.basicProfile.country.isMulticulture ? "예" : "아니요"}
            label="다문화 여부"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value?.basicProfile?.birth?.toDate()?.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
            label="생년월일"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value?.email}
            label="이메일"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value.basicProfile.providerId || "이메일"}
            label="로그인 경로"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            fullWidth
            variant="outlined"
            value={value.uid}
            label="유저 코드"
            size="small"
            // onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={12} sx={{mt:"20px"}}>
          <MuiButton small label="저장" onClick={onSaveClick} fullWidth isLoading={isSaving}/>
        </Grid>
      </Grid>

    </div>
  )
}

export default UserViewOverview