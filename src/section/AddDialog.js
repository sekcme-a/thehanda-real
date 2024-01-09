
import { TextField, Button } from "@mui/material"
import { useState } from "react"
import { useRouter } from "next/router"
import useData from "context/data"

import { firestore as db } from "firebase/firebase"

const AddDialog = ({sections, setSections, setComponents, renderComponent, setIsOpenDialog}) => {
  const router = useRouter()
  const {id, type} = router.query

  const {team} = useData()

  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const onAddClick = async () => {
    const is_independent = (val) => {
      for(const item of sections){
        if(item.name===val){
          return false
        }
      }
      return true
    } 

    setIsLoading(true)
    if(value==="" || value===" ") alert("섹션명은 공백이 될 수 없습니다.")
    else if(!is_independent(value)) alert("이미 있는 섹션명입니다.")
    else {

      //get random Id
      const doc = await db.collection("team").doc(id).collection("section").doc().get()
      const tempSections = [...sections,
        {
          name: value, 
          id: doc.id, 
          createdAt: new Date().toLocaleDateString()
        }
      ]
      setSections([...tempSections])
      let temp = []
      for (let i =0 ; i<tempSections.length; i++){
        temp.push(renderComponent(tempSections[i]))
      }
      setComponents([...temp])
      setIsOpenDialog(false)
      setValue("")
    }
    setIsLoading(false)
  }


  return(
    <div style={{padding: "20px 30px", backgroundColor:"white", borderRadius:"5px "}}>
      <h1 style={{marginBottom:"15px"}}>추가할 섹션명을 입력해주세요</h1>
      <TextField variant="standard" value={value} onChange={(e)=>setValue(e.target.value)}/>
      <Button onClick={onAddClick} disabled={isLoading}>
        {isLoading ? "저장 중" : "추가" }
      </Button>
    </div>
  )
}

export default AddDialog