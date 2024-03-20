import { useEffect, useState } from "react"
import styles from "src/story/docId/index.module.css"
import { useRouter } from "next/router"

import ImageDropZone from "src/public/components/ImageDropZone/ImageDropZone"
import MuiTextField from "src/public/mui/MuiTextField"
import { CircularProgress, Switch, TextField } from "@mui/material"
import MuiButton from "src/public/mui/MuiButton"
import useUserData from "context/userData"
import { PERMISSION } from "src/public/hooks/checkPermission"
import { FUNCTION } from "src/story/docId/IndexFunction"
import { IMAGEHANDLE } from "src/public/hooks/compressImageHandle"

import { firestore as db } from "firebase/firebase"

const EditStory = () => {
  const {userData} = useUserData()
  const router = useRouter()
  const {id, docId} = router.query

  const [files, setFiles] = useState([])
  const [deletedFiles, setDeletedFiles] = useState([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [allowComment, setAllowComment] = useState(true)
  const [showLikeCount, setShowLikeCount] = useState(true)

  const [storyData, setStoryData] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)

  const [isNewStory, setIsNewStory] = useState(true)




  useEffect(()=> {

    const fetchData = async () => {
      setIsLoading(true)
      setDeletedFiles([])
      const data = await FUNCTION.read_story_from_docId(id, docId)
      if(data){
        setStoryData(data)
        setTitle(data.title)
        setContent(data.content)
        setFiles(data.imgs)
        setAllowComment(data.allowComment)
        setShowLikeCount(data.showLikeCount)
        setIsNewStory(false)
      }
      setIsLoading(false)
    }
    fetchData()
  },[docId])

  const onSaveClick = async () => {
    setIsWorking(true)
    if(FUNCTION.has_title_and_has_at_least_one_image(files, title)){

      if(FUNCTION.is_all_element_image_data_or_url_data){
        //1MB 이상은 압축
        const compressedFiles = await FUNCTION.check_img_max_size_and_compress(files, 1)

        const uploadResultFiles = await FUNCTION.upload_images_to_storage(compressedFiles, `${id}/story/${docId}`)

        await FUNCTION.upload_story_to_firestore({
          ...storyData,
          imgs: uploadResultFiles,
          title: title,
          content: content,
          allowComment: allowComment,
          showLikeCount: showLikeCount,
        }, id, docId)

        await FUNCTION.delete_deleted_images_from_storage(deletedFiles)

        setDeletedFiles([])
        setIsNewStory(false)
        
        alert("저장되었습니다.")
        setIsWorking(false)
        return true
        
      } else alert("이미지 파일만 선택할 수 있습니다.\n (.jpg .gif .png .jpeg .bmp)")

    } else alert("이미지나 제목 없이 업로드하실 수 없습니다.")
    setIsWorking(false)
  }




  const onPublishClick = async () => {
    setIsWorking(true)
    if(confirm("게재하시겠습니까?")){
      const res = await onSaveClick()
      if(res){
        const res2 =await FUNCTION.publish_story(id, docId)
        if(res2){
          alert("게재되었습니다.")
          setStoryData(prev=> ({
            ...prev,
            condition: "게재중"
          }))
        }
      }
    }
    setIsWorking(false)
  }




  const onUnpublishClick = async () => {
    setIsWorking(true)
    if(confirm("개재취소하시겠습니까?")){
      if(await FUNCTION.unpublish_story(id, docId)){
        alert("게재취소되었습니다.")
        setStoryData(prev=> ({
          ...prev,
          condition: "미게재"
        }))
      }
    }
    setIsWorking(false)
  }



  const onDeleteClick = async () => {
    setIsWorking(true)
    if(confirm("해당 게시물을 삭제하시겠습니까?")){
      await FUNCTION.delete_images_from_storage(id,docId)
      await FUNCTION.delete_story(id, docId)
      alert("게시물이 삭제되었습니다.")
      router.back()
    }
    setIsWorking(false)
  }



  if(isLoading) return <CircularProgress />
  return(
    <div className={styles.main_container}>
      <div className={styles.content_container} >
        <h3 style={{marginBottom:"10px", marginTop:"20px"}}>이미지 업로드</h3>
        <ImageDropZone style={{width:'100%'}} {...{files, setFiles, deletedFiles, setDeletedFiles}}/>
        <p style={{marginTop:"10px", fontSize:"12px"}}>*권장 사이즈 1850*1300</p>
        <p style={{marginTop:"10px", fontSize:"12px"}}>*이미지를 클릭하시면 전체화면으로 보실 수 있습니다.</p>
        <p style={{marginTop:"5px", fontSize:"12px"}}>*이미지를 잠시동안 누른 후 드래그하시면 이미지의 위치를 변경하실 수 있습니다.</p>

        <div style={{width:"100%"}}>
          <MuiTextField
            label="제목"
            sx={{mt:"20px"}}
            fullWidth value={title} setValue={setTitle}
          />
          <MuiTextField
            label="내용"
            sx={{mt:"20px"}}
            fullWidth
            value={content} setValue={setContent}
            outlined
            multiline
            maxRows={15}
          />
        </div>

        <div style={{display:"flex", alignItems:"center", marginTop: "18px"}} >
          <p>좋아요 수 표시 {!showLikeCount && "안함"}</p>
          <Switch
            checked={showLikeCount}
            onChange={(e) => setShowLikeCount(e.target.checked)}
          />
          <p style={{marginLeft:"30px"}}>댓글 허용 {!allowComment && "안함"}</p>
          <Switch
            checked={allowComment}
            onChange={(e) => setAllowComment(e.target.checked)}
          />
        </div>

        <div className={styles.buttons_container}>
          <MuiButton label="저장" sx={{mr:"10px"}} onClick={onSaveClick}
            isLoading={isWorking}
          />
          {
            PERMISSION.isSuperAdmin(userData.roles, id ) && !isNewStory && 
              <MuiButton label="삭제" error sx={{mr:"10px"}} onClick={onDeleteClick}/>
          }
          {storyData?.condition==="게재중" ? 
            <MuiButton label="게재 취소" sx={{mr:"10px"}} secondary onClick={onUnpublishClick} isLoading={isWorking}/>
            :
            <MuiButton label="게재" sx={{mr:"10px"}} onClick={onPublishClick} isLoading={isWorking}/>
          }
        </div>

      </div>
    </div>
  )
}

export default EditStory