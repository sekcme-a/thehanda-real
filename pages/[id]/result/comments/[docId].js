
import { useRouter } from "next/router"
import { useState } from "react"
import { useEffect } from "react"

import { fetch_header_data_and_title,fetch_result_data, refine_result_data,confirm_users, participate_users } from "src/result/ResultFunctions"

import CSVTable from "src/result/CSVTable"
import { CSVDownload, CSVLink } from "react-csv";

import ImportExportIcon from '@mui/icons-material/ImportExport';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';


import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from "@mui/material"
import { CircularProgress } from "@mui/material"
import { sendMultipleNotification, sendNotification } from "src/public/hooks/notification"
import { FormControl, InputLabel } from "@mui/material"

import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AlarmDialog from "src/result/AlarmDialog"

const Result = () => {
  const router = useRouter()
  const {id, type, docId} = router.query

  const [header, setHeader] = useState([])
  const [result, setResult ] = useState([])
  const [title, setTitle] = useState("")

  const [checkedList, setCheckedList] = useState([])

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=> {


    const fetchData = async () => {
      try{
        const fetchedHeader = await fetch_header_data_and_title(id, 'comments', docId, "comments")
        const fetchedResult = await fetch_result_data(id,'comments',docId)
        const refinedResult = await refine_result_data(fetchedResult)
        console.log(refinedResult)
        setTitle(fetchedHeader.title)
        setHeader([...fetchedHeader.headerData])
        setResult(refinedResult)
        setIsLoading(false)
      }catch(e){
        alert(`Error: ${e}`)
      }
    }
    fetchData()
  },[])

  const onParticipatedClick = async (isParticipated) => {
    if(checkedList.length===0){
      alert("선택된 유저가 없습니다.")
      return;
    }
    try{
      let hasUnconfirmedUser = false
      //checkedList 에 미승인 유저가 있다면 불가
      checkedList.map((uid) => {
        result.map((file) => {
          if(file.id === uid && file.confirmed==="미승인"){
            hasUnconfirmedUser = true
            return;
          }
        })
      })
      if(hasUnconfirmedUser){
        alert("참여 미승인된 사용자에게는 참여/미참여 처리를 할 수 없습니다.\n해당 사용자 신청 승인 후 재시도해주세요.")
        return
      }

      if(confirm(`${!isParticipated ? "미" : ""}참여 처리 하시겠습니까?`)){
        await participate_users(id, type, docId, checkedList, isParticipated)
        alert(`성공적으로 ${!isParticipated ? "미": ""}참여 처리되었습니다.`)
        router.reload()
      }
    }catch(e){
      console.log(e)
    }
  }



  if(isLoading) (<CircularProgress />)
  return(
    <>
      <h1 style={{fontSize:"20px", fontWeight:"bold", marginBottom:"10px"}}>프로그램 후기 결과 확인</h1>
      <p style={{fontSize:"15px", marginBottom:"40px"}}>{`프로그램 후기 결과입니다.`}</p>





      <div style={{marginTop:"20px"}} />

      

      <CSVTable title={title} headers={header} data={result} type={type} docId={docId} {...{checkedList, setCheckedList}} noFilter/>

      <AlarmDialog isDialogOpen={isAlertDialogOpen} setIsDialogOpen={setIsAlertDialogOpen} checkedList={checkedList} />
    </>
  ) 
}

export default Result