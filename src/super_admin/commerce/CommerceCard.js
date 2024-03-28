
import { Button } from "@mui/material"
import styles from "./CommerceCard.module.css"

import { firestore as db } from "firebase/firebase"
import ImageDropZone from "src/public/components/ImageDropZone/ImageDropZone"
import { useEffect, useState } from "react"
import MuiTextField from "src/public/mui/MuiTextField"
import { STORAGE } from "src/public/hooks/storageCRUD"
import useData from "context/data"


const CommerceCard = ({key, id, title, ratio, data, setCommercial, mode}) => {
  const [files, setFiles] = useState([])
  const [deletedFiles, setDeletedFiles] = useState([])

  const [link, setLink] = useState("")



  useEffect(()=> {
    if(data){
      setFiles([
        {
          path: data?.path, 
          url: data?.url,
        }
      ])
      setLink(data?.link)
    }
  },[data])


  const urlContainsHttpsOrBlank = (url) => {
    if(url.includes("https://") || url==="") return true
    else {
      alert("link 에는 https://가 포함되거나 빈칸이여야합니다.")
      return false
    }
  }

  const onDefaultClick = async () => {

    if(!urlContainsHttpsOrBlank(link)) return
    
    await db.collection("commercial").doc(mode).update({
      [id]: {
        url:`/images/commerce/${id}.png`,
        path:"default", 
        link: link
      }
    })

    setCommercial(prev=>({
      ...prev,
      [id]: {
        url:`/images/commerce/${id}.png`,
        path:"default", 
        link: link
      }
    }))

    alert("적용되었습니다.")
  }

  const onAdsenseClick = async () => {

  }

  const onCustomClick = async () => {
    if(!urlContainsHttpsOrBlank(link)) return

    if(files.length===0){
      alert("광고 이미지를 삽입해주세요.")
      return
    }

    try{

      //파일이 변경되었다면
      if(files[0].data instanceof File){
        const storageData = await STORAGE.upload_file_v2(
          files[0].data,
          `commercial/admin/${id}`,
          "pathWithoutUuid",
          "compress", 1
        )
      await db.collection("commercial").doc(mode).update({
        [id]: {
          ...storageData,
          link: link
        }
      })

      setCommercial(prev => ({
        ...prev,
        [id]: {
          ...storageData,
          link: link
        }
      }))
    } else {
      await db.collection("commercial").doc(mode).update({
        [id]: {
          ...data,
          link: link
        }
      })
      setCommercial(prev => ({
        ...prev,
        [id]: {
          ...data,
          link: link
        }
      }))
    }
  
      alert("적용되었습니다.")


    }catch(e){
      alert(e)
    }
  }


  return(
    <div className={styles.main} key={key}>
      <h1>
        <strong>{title}</strong> | 권장비율 {ratio} |  
        <strong className={styles.condition}>
        {data?.path==="default"||data?.path?.length===0 ? "기본화면": 
          data?.path==="adsense" ? "에드센스" : !data?.path ? '없음' : "이미지광고"}
        </strong>
      </h1>
      <Button onClick={onDefaultClick}>기본화면으로 설정</Button>
      <Button onClick={onAdsenseClick} disabled={true}>에드센스로 설정</Button>
      <Button onClick={onCustomClick}>이미지 광고로 설정</Button>
      <div>
        <MuiTextField
          value={link}
          setValue={setLink}
          label="링크"
          sx={{mb:"20px"}}
          fullWidth
        />
      </div>
      <ImageDropZone
        {...{files, setFiles, setDeletedFiles}}
        recommandSize={ratio}
        maxImgCount={1}
      />
    </div>
  )
}

export default CommerceCard