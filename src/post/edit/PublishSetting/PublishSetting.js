import styles from "./PublishSetting.module.css"

import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Switch } from '@mui/material';
import SwitchDateTimePicker from "./components/SwitchDateTimePicker";
import SwitchNumTextfield from "./components/SwitchNumTextfield";
import Schedule from "./components/Schedule";
import { useRouter } from "next/router";


const PublishSetting = ({postValues, setPostValues, calendar, setCalendar}) => {

  const router = useRouter()
  const {type} = router.query


  return(
    <>
      <div style={{margin: "25px 0 7px 0", width:"100%",}}>
        <SwitchDateTimePicker {...{postValues, setPostValues}} type="hasReserve" value="startAt" text="예약게재일" />
        <SwitchDateTimePicker {...{postValues, setPostValues}} type="hasDeadline" value="endAt" text="신청마감일" />
        {type==="programs" &&
          <>
            <SwitchDateTimePicker {...{postValues, setPostValues}} type="hasProgramStart" value="programStartAt" text="프로그램 시작일" />

            <div style={{width:"100%", height:"30px"}} />
            <SwitchNumTextfield {...{postValues, setPostValues}}/>
            <div className={styles.switch_container} style={{marginTop:"20px"}}>
              <Switch
                checked={postValues.autoConfirm}
                onChange={(e)=>setPostValues(prevValues => ({...prevValues, autoConfirm: e.target.checked}))}
                size="small"
              />
              <p>
                {postValues.autoConfirm ?
                  "자동 참가확정 - 유저가 제출한 즉시 프로그램 참가가 확정되며, 해당 유저의 일정에도 반영됩니다."
                  :
                  "수동 참가확정 - 관리자가 '결과보기' 화면에서 수동으로 참가확정을 클릭해야 하며, 참가 확정 전에는 유저들에게 '참가 미확정'으로 표시됩니다."
                }
              </p>
            </div>

            <div style={{width:"100%", height:"30px"}} />
            <Schedule  {...{postValues, setPostValues, calendar, setCalendar}}  />
          </>
        }

      </div>
    </>

  )
}

export default PublishSetting