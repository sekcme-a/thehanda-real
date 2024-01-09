
import { TextField, Button } from "@mui/material"
import { useState } from "react"
import { useRouter } from "next/router"
import useData from "context/data"

import { firestore as db } from "firebase/firebase"

const EditDialog = ({sections, setSections, setComponents, renderComponent, setIsOpenDialog}) => {
  const router = useRouter()
  const {id, type} = router.query

  const {team} = useData()

  const [prevValue, setPrevValue] = useState("")
  const [newValue, setNewValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const onEditClick = () => {
    const is_exist = (val) => {
      let hasItem = false
      for(const item of sections) {
        if(item.name===val) hasItem=true
      }
      return hasItem
    }
    const is_independent = (val) => {
      for(const item of sections){
        if(item.name===val){
          return false
        }
      }
      return true
    } 

    setIsLoading(true)
    if(!is_exist(prevValue))
      alert("일치하는 섹션명이 없습니다.")
    else if(!is_independent(newValue)){
      alert("새로운 섹션명이 이미 존재하는 이름입니다.")
    }
    else if(confirm("섹션명을 변경하시겠습니까?")){
      let temp =[]
      let temp2 = []
      for(const item of sections){
        if(item.name===prevValue){
          temp.push({...item, name: newValue})
          temp2.push(renderComponent({...item, name: newValue }))
        }
        else {
          temp.push(item)
          temp2.push(renderComponent(item))
        }
      }
      setSections([...temp])
      setComponents([...temp2])
      setPrevValue("")
      setNewValue("")
      setIsOpenDialog(false)
    }
    setIsLoading(false)
  }

  return(
    <div style={{padding: "20px 30px", backgroundColor:"white", borderRadius:"5px "}}>
      <TextField variant="standard" value={prevValue} onChange={(e)=>setPrevValue(e.target.value)} fullWidth label="변경할 섹션명" placeholder='변경할 섹션명을 입력해주세요.'/>
      <TextField variant="standard" sx={{mt:"10px"}} value={newValue} onChange={(e)=>setNewValue(e.target.value)} fullWidth label="새로운 섹션명" placeholder='새로운 섹션명을 입력해주세요.' />
      <Button onClick={onEditClick} variant='contained' sx={{mt:"20px"}} size="small" disabled={isLoading}>
        {isLoading ? "저장 중" : "변경" }
      </Button>
    </div>
  )
}

export default EditDialog