import { useState, useEffect } from "react"

import CSVTable from "src/public/components/CSVTable"
import AlarmDialog from "src/result/AlarmDialog"
import useData from "context/data"

import styles from "./userList.module.css"

import { Button } from "@mui/material"
import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import { useRouter } from "next/router"

const UserList = () => {
  const {team, userList, fetch_userList} = useData()
  const router = useRouter()

  const [list, setList] = useState(userList)
  const [checkedList, setCheckedList] = useState([])

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  useEffect(()=> {
    setList(userList)
  },[userList])

  const HEADERS = [
    {key: "realName", label:"실명"},
    {key: "displayName", label:"닉네임"},
    {key: "gender", label:"성별"},
    {key:"countryFlag", label:"국적"},
    {key:"phoneNumber", label:"전화번호"},
    {key:"email", label:"이메일"}
  ]




  const onItemClick = (id) => {
    router.push(`/${team.teamId}/user/${id}`)
  } 

  return(
    <>
      <div className={styles.main_container}>
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

      <AlarmDialog isDialogOpen={isAlertDialogOpen} setIsDialogOpen={setIsAlertDialogOpen} checkedList={checkedList} />
    </>
  )
}

export default UserList