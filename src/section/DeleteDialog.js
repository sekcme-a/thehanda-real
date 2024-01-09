
import { TextField, Button } from "@mui/material"
import { useState } from "react"
import { useRouter } from "next/router"
import useData from "context/data"

import { firestore as db } from "firebase/firebase"

const DeleteDialog = ({sections, setSections, setComponents, renderComponent, setIsOpenDialog}) => {
  const router = useRouter()
  const {id, type} = router.query

  const {team} = useData()

  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const onDeleteClick = async () => {
    const is_exist = (val) => {
      let hasItem = false
      for(const item of sections) {
        if(item.name===value) hasItem=true
      }
      return hasItem
    }

    let temp = []
    let temp2 = []
    setIsLoading(true)
    if(!is_exist(value))
      alert("일치하는 섹션명이 없습니다.")
    else if(confirm("섹션을 삭제하시겠습니까?\n모든 프로그램에 해당 섹션이 지워집니다.")){
      for(const item of sections){
        if(item.name!==value){
          temp.push(item)
          temp2.push(renderComponent(item))
        }
      }
      setSections([...temp])
      setComponents([...temp2])
      setValue("")
      setIsOpenDialog(false)
    }
    setIsLoading(false)
  }


  return(
    <div style={{padding: "20px 30px", backgroundColor:"white", borderRadius:"5px "}}>
      <h1 style={{marginBottom:"15px"}}>삭제할 섹션명을 입력해주세요</h1>
      <TextField variant="standard" value={value} onChange={(e)=>setValue(e.target.value)}/>
      <Button onClick={onDeleteClick} disabled={isLoading} color="error">
        {isLoading ? "저장 중" : "삭제" }
      </Button>
    </div>
  )
}

export default DeleteDialog