import { Grid, TextField } from "@mui/material"
import { useEffect, useState } from "react"


const UserViewOverview = ({data, setData}) => {

  const [value, setValue] = useState(data)

  useEffect(() => {
    setValue(data)
  },[data])

  const handleChange = (key, val) => {
    setValue(prevValue => ({
      ...prevValue,
      basicProfile: {
        ...prevValue.basicProfile,
        [key]: val,
      } 
    }))
    console.log(value.basicProfile)
  }

  return (
    <div>
      {/* <p style={{fontSize:"15px", marginTop:"7px", marginBottom:"20px"}}>{`해당 유저의 프로필 정보를 수정하실 수 있습니다. (해당 유저의 어플에도 동일 적용됩니다)`}</p> */}
      <Grid container rowSpacing={2} columnSpacing={1}>
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
      </Grid>

    </div>
  )
}

export default UserViewOverview