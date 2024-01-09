import styles from "../PublishSetting.module.css"

import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Switch } from '@mui/material';


const SwitchDateTimePicker = ({postValues, setPostValues, type, value, text}) => {

  return(
    <div className={styles.switch_container}>
      <Switch
        checked={postValues[type]}
        onChange={(e)=>setPostValues(prevValues => ({...prevValues, [type]: e.target.checked}))}
        size="small"
      />
      <p>{text} {postValues[type] ? "있음" : "없음"}</p>
      {postValues[type] && 
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDateTimePicker
            label={`${text}을 선택해주세요.`}
            value={postValues[value]} 
            onChange={(e)=>setPostValues({...postValues, [value]: e})}
            renderInput={params => <TextField {...params} />}
          />
        </LocalizationProvider>
      }
    </div>
  )
}

export default SwitchDateTimePicker