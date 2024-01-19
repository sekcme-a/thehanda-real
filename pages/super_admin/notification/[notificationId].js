
import { Button, CircularProgress, TextField } from "@mui/material"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


const NotificationPost = () => {
  const router = useRouter()
  const {notificationId} = router.query 

  const [input, setInput] = useState({
    title: "",
    content:"",
    condition:"미게재",
  })
  const handleInput = (value, key) => {
    setInput(prevInput => ({
      ...prevInput,
      [key]: value,
    }))
  }

  const [isNewPost, setIsNewPost] = useState(true)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=> {

    const fetchData = async () => {
      setIsLoading(true)
      const doc = await db.collection("admin_notification").doc(notificationId).get()
      if(doc.exists){
        setInput({
          title: doc.data().title,
          content: doc.data().content,
          condition: doc.data().condition,
        })
        setIsNewPost(false)
      }
      setIsLoading(false)
    }

    fetchData()
  },[notificationId])


  const onSaveClick = async () => {
    const DATA = {
      ...input,
      savedAt: new Date(),
    }
    if(isNewPost)
      await db.collection("admin_notification").doc(notificationId).set({
        ...DATA,
        condition: "미게재"
      })
    else
      await db.collection("admin_notification").doc(notificationId).update({
        ...DATA,
      })
    setIsNewPost(false)
    alert("저장했습니다.")
  }


  const onConditionClick = async () => {
    await db.collection("admin_notification").doc(notificationId).update({
      ...input,
      savedAt: new Date(),
      condition: input.condition==="게재중" ? "미게재":"게재중"
    })
    
    if(input.condition==="게재중"){
      handleInput("미게재", "condition")
      alert("게재취소되었습니다.")
    }
    else{
      handleInput("게재중", "condition")
      alert("게재되었습니다.")
    }
  }

  const onDeleteClick = async () => {

    if(confirm("정말 삭제하시겠습니까?")){
      await db.collection("admin_notification").doc(notificationId).delete()
      alert("삭제되었습니다.")
      router.back()
    }
  }


  if(isLoading) (<CircularProgress />)

  return(
    <div style={{padding:"40px"}}>
      <TextField
        size="small"
        margin="dense"
        fullWidth
        label="제목"
        value={input.title}
        onChange={(e) => handleInput(e.target.value,'title')}
      />
      <TextField
        size="small"
        margin="dense"
        fullWidth
        multiline
        rows={10}
        label="내용"
        value={input.content}
        onChange={(e) => handleInput(e.target.value,'content')}
      />

      {isNewPost && <p style={{marginTop:"20px", fontSize:"13px"}}>저장 후 게재하실 수 있습니다.</p>}

      <div style={{display:"flex", flexWrap:"wrap", alignItems:"center", marginTop:"5px" }}>
        <Button
          sx={{mr:"15px"}}
          onClick={onSaveClick}
          size="small"
          variant="contained"
        >저장</Button>

        <Button
          color={input.condition==="게재중" ? "error" : "primary"} sx={{mr:"15px"}}
          onClick={onConditionClick}
          size="small"
          variant="contained"
          disabled={isNewPost}
        >{input.condition==="게재중" ? "게재취소" : "게재"}</Button>

        {
          !isNewPost && <Button
            color="error"
            onClick={onDeleteClick}
            size="small"
            variant="contained"
          >삭제</Button>
        }
      </div>
    </div>
  )
}

export default NotificationPost