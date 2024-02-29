import { useState, useEffect } from "react"

import CSVTable from "src/public/components/CSVTable"
import AlarmDialog from "src/result/AlarmDialog"
import useData from "context/data"

import styles from "./userList.module.css"

import { Button } from "@mui/material"
import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useRouter } from "next/router"
import MuiButton from "src/public/mui/MuiButton"

const UserList = () => {
  const {team, userList, fetch_userList} = useData()
  const router = useRouter()

  const [list, setList] = useState(userList)
  const [checkedList, setCheckedList] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  useEffect(()=> {
    setList(userList)
  },[userList])

  const HEADERS = [
    {key: "realName_additionalRealname", label:"실명"},
    {key: "displayName", label:"닉네임"},
    {key: "gender", label:"성별"},
    {key:"countryFlag", label:"국적"},
    {key:"phoneNumber_additionalPhoneNumber", label:"전화번호"},
    {key:"email", label:"이메일"}
  ]


  const onRefresh = async () => {
    setIsLoading(true)
    await fetch_userList(team.teamId, true)
    setIsLoading(false)
  }



  const onItemClick = (data) => {
    router.push(`/${team.teamId}/user/${data.id}`)
  } 

  return(
    <>
      <div className={styles.main_container}>
        <MuiButton
          small sx={{ml:"10px"}} onClick={onRefresh}
          label="새로고침" labelIcon={<RefreshRoundedIcon />}
          isLoading={isLoading}
        />
        
        <Button
          variant="contained"
          size="small"
          sx={{ml:"10px"}}
          color="secondary"
          onClick={() =>setIsAlertDialogOpen(true)}
          // style={{backgroundColor:"rgb(25, 51, 167)"}}
        >
          <EditNotificationsOutlinedIcon />
          알림 보내기
        </Button>


        <CSVTable
          title={`${team.teamName} 사용자 목록`}
          headers={HEADERS}
          data={list}
          style={{width:"50%"}}
          hasCheck
          {...{checkedList, setCheckedList, onItemClick}}
        />
      </div>

      <AlarmDialog isDialogOpen={isAlertDialogOpen} setIsDialogOpen={setIsAlertDialogOpen} checkedList={checkedList} showCodeInput />
    </>
  )
}

export default UserList