import { Button } from "@mui/material"
import useUserData from "context/userData"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"

const HandleSubmit = ({postValues, setPostValues}) => {
  const router = useRouter()
  const {id, postId} = router.query
  const {userData} = useUserData()

  const onSaveClick = async () => {   
    if(postValues.selectedSections.length === 0 ){
      alert("섹션을 한개이상 선택해주세요.")
      return false
    }
    if(postValues.title === ""){
      alert("제목은 빈칸일 수 없습니다.")
      return false
    }
    await db.collection("team").doc(id).collection("announcements").doc(postId).set({
      ...postValues,
      history: [{type:"create", date: new Date(), text:`"${userData.name}" 님에 의해 생성됨.`},...postValues.history],
      savedAt: new Date(),
      lastSaved: userData.name,
    })
    alert("성공적으로 저장되었습니다.")
    return true
  }

  const onPublishClick = async () => {
    const res = await onSaveClick()
    if(res){
      await db.collection("team").doc(id).collection("announcements").doc(postId).update({
        history: [{type: "confirm", date: new Date(), text:`"${userData.name}" 님에 의해 승인후 게재되었습니다.`}, ...postValues.history],
        savedAt: new Date(),
        lastSaved: userData.name,
        condition: "confirm"
      })
      alert("성공적으로 게재되었습니다.")
      router.reload()
    }
  }

  const onCancelClick = async () => {
    await db.collection("team").doc(id).collection("announcements").doc(postId).update({
      condition: "unconfirm",
      history: [{type:"cancelDeploy", date: new Date(), text:`"${userData.name}" 님에 의해 게재 취소되었습니다.`}, ...postValues.history],
      savedAt: new Date(),
      lastSaved: userData.name
    })
    alert("게재취소되었습니다.")
    router.reload()
  }

  return(
    <div style={{marginTop:"50px"}}>
      <Button
        variant="contained"
        onClick={onSaveClick}
        size="small"
        sx={{mr:"20px"}}
      >
        저 장
      </Button>
      {
        postValues.condition==="confirm" ? 
          <Button
            variant="contained"
            onClick={onCancelClick}
            size="small"
            sx={{backgroundColor:"rgb(176, 36, 36)"}}
          >
            게재 취소
          </Button>
          :
          <Button
            variant="contained"
            onClick={onPublishClick}
            size="small"
            sx={{backgroundColor:"rgb(45, 45, 179)"}} 
          >
            저장 후 게재
          </Button>
      }
    </div>
  )
}

export default HandleSubmit