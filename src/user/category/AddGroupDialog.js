import { useState, useEffect } from "react"
import {Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import useUserData from "context/userData"
import { useRouter } from "next/router"

const AddGroupDialog = ({openDialog, setOpenDialog}) => {
  const router = useRouter()
  const {team} = useData()
  const {userData} = useUserData()

  const [name, setName] = useState("")
  const [explain, setExplain] = useState("")

  const [isCreating, setIsCreating] = useState(false)


  const handleAddClick = async () => {
    if(name.length<3) alert("그룹명이 너무 짧습니다.")
    else{
      setIsCreating(true)
      const doc = await db.collection("team_admin").doc(team.teamId).collection("groups").where("name","==",name).get()
      if(doc.empty){
        console.log(userData)
        await db.collection("team_admin").doc(team.teamId).collection("groups").doc().set({
          name: name,
          explain: explain,
          author: userData.name,
          createdAt: new Date(),
          savedAt: new Date()
        })
        alert("그룹이 생성되었습니다.")
        router.reload()
      } else {
        alert("이미 있는 그룹명입니다.")
      }
    }
    setIsCreating(false)

    
  }

  return(
    <Dialog
      open={openDialog==="addGroup"}
      onClose={()=>setOpenDialog("")}
    >
      <DialogTitle>그룹 생성</DialogTitle>
        <DialogContent>
          <DialogContentText>
            그룹명과 그룹 설명을 작성해주세요. 그룹을 통해 원하는 유형의 사용자들을 따로 관리하실 수 있습니다.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="그룹명"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            label="그룹 설명"
            value={explain}
            onChange={(e) => setExplain(e.target.value)}
            multiline
            maxRows={5}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDialog("")} color="error" disabled={isCreating}>취소</Button>
          <Button onClick={handleAddClick}
            variant="contained" size="small" margin="dense"
            disabled={isCreating}
          >{isCreating ? "생성 중..." : "+ 생성"}</Button>
        </DialogActions>
    
    </Dialog>
  )
}

export default AddGroupDialog