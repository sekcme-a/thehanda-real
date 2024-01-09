import styles from "../PublishSetting.module.css"
import { Switch, TextField } from "@mui/material"

const SwitchNumTextfield = ({postValues, setPostValues}) => {
  return(
    <div className={styles.switch_container}>
      <Switch checked={postValues.hasLimit} onChange={(e)=>{setPostValues({...postValues, hasLimit: e.target.checked})}} size="small" />
      <p>{postValues.hasLimit ? "신청인원 제한있음 - 신청한 유저의 인원제한이며, 참가확정 인원과는 무관합니다." : "신청인원 제한없음"}</p>
      {postValues.hasLimit &&
        <TextField label="인원수" size="small" value={postValues.limitCount} onChange={(e)=>{
          if(!isNaN(e.target.value))
            setPostValues({...postValues, limitCount: e.target.value})
          else{
            alert("입력값은 숫자여야합니다.")}
          }
        }/>
      }
    </div>
  )
}

export default SwitchNumTextfield