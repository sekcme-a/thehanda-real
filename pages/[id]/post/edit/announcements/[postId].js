import { useState, useEffect } from "react"
import styles from "src/post/edit/program.module.css"

import MultipleChipInput from "src/post/edit/components/MultipleChipInput"
import TextInput from "src/post/edit/components/TextInput"
import { CircularProgress, TextField } from "@mui/material"
import EmojiSelector from "src/public/components/EmojiSelector"
import HandleSubmit from "src/post/edit/announcement/HandleSubmit"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

const Announcements = () => {
  const router = useRouter()
  const {id, postId} = router.query
  const [postValues, setPostValues] = useState({
    title:"",
    content:"",
    selectedSections: [],
    history: [],
    condition: "unconfirm"
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const doc = await db.collection("team").doc(id).collection("announcements").doc(postId).get()
      if(doc.exists){
        setPostValues({
          ...doc.data()
        })
      }
      setIsLoading(false)
    }
    fetchData()
  },[postId])

  const onContentChange = (e) => {
    setPostValues(prevValues=>({
      ...prevValues,
      content: e.target.value
    }))
  }

  if(isLoading)
    return(<CircularProgress />)

  return(
    <div className={styles.main_container}>
      <div className={styles.content_container}>
        <div className={styles.item_container}>
          <h1>유형</h1>
          <MultipleChipInput {...{postValues, setPostValues}} type="announcements"/>
        </div>
        <div className={styles.border} />

        <EmojiSelector />

        <TextInput title="제목" placeholder="제목을 입력하세요." id="title"
        {...{postValues, setPostValues}} />
        <div className={styles.item_container} style={{marginTop:"30px"}}>
          <h1></h1>
          {/* <p style={{color:"red"}}>{`<<<>>> 표시로 해당 괄호안에있는 내용을 강조체로 표시합니다.  예)<<<강조할 내용>>>`}</p> */}
        </div>
        <div className={styles.item_container} style={{marginTop:"10px"}}>
          <h1>내용</h1>
          
          <TextField
            label="내용"
            variant="standard"
            placeholder="내용을 입력하세요."
            value={postValues.content}
            onChange={onContentChange}
            multiline
            rows={5}
            maxRows={15}
            size="small"
            fullWidth
          />
        </div>


        <HandleSubmit {...{postValues}}/>
      </div>
    </div>
  )
}

export default Announcements