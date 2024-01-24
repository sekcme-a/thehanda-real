import styles from "./EditPost.module.css"
import { useState, useEffect } from "react"

import EmojiSelector from "src/public/components/EmojiSelector"

import { Checkbox, CircularProgress } from "@mui/material"
import CheckBoxInput from "./components/CheckBoxInput"
import MultipleChipInput from "./components/MultipleChipInput"
import TextInput from "./components/TextInput"
import ThumbnailInput from "./components/ThumbnailInput"
import InfoInput from "./components/InfoInput"
import ImageInput from "./components/ImageInput"
import QuickLinkInput from "./components/QuickLinkInput"

import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"
import { TruckAlertOutline } from "mdi-material-ui"

const EditPost = ({postValues, setPostValues, selectedImageList, setSelectedImageList}) => {
  const router = useRouter()
  const {id, type} = router.query
  const [sections, setSections] = useState([])
  const [selectedSections, setSelectedSections] = useState([])

  const [isLoading, setIsLoading] = useState(false)




  if(isLoading) return (<CircularProgress />)

  return(
    <>
      {type==="programs" && 
        <>
          <div className={styles.item_container}>
            <h1>등급</h1>
            <CheckBoxInput mode="isMain" {...{postValues, setPostValues}}/>
          </div>
          <div className={styles.item_container}>
            <h1>타입</h1>
            <CheckBoxInput mode="type" {...{postValues, setPostValues}}/>
          </div>
        </>
      }
      <div className={styles.item_container}>
        <h1>상태</h1>
        <CheckBoxInput mode="condition" {...{postValues, setPostValues}}/>
      </div>


      <div className={styles.border} />


      <div className={styles.item_container}>
        <h1>유형</h1>
        <MultipleChipInput {...{postValues, setPostValues, type}}/>
      </div>


      <div className={styles.border} />


      <TextInput title="제목" placeholder="제목을 입력하세요." id="title"
        {...{postValues, setPostValues}} />
      <TextInput title="부제목" placeholder="부제목을 입력하세요." id="subtitle"
        {...{postValues, setPostValues}} />
      <TextInput title="기간문구" placeholder="기간문구를 입력하세요." id="dateText"
        {...{postValues, setPostValues}} />


      <div className={styles.border} />

      <ThumbnailInput {...{postValues, setPostValues}}/>


      <div className={styles.border} />

      <EmojiSelector />

      <TextInput title="소개문구" placeholder="페이지 최상단에 위치합니다." id="welcome"
        {...{postValues, setPostValues}} multiline />


      <div style={{marginTop:"20px"}} />
      <TextInput title="메인정보창 작성" placeholder="페이지 상단 회색 정보창에 위치합니다." id="mainInfo"
        {...{postValues, setPostValues}} multiline />

      <InfoInput {...{postValues, setPostValues}} />
      
      <ImageInput {...{selectedImageList, setSelectedImageList}} />
      
      <QuickLinkInput {...{postValues, setPostValues}} />
      
      {/* 사진 추가 업데이트 */}


    </>
  )
}

export default EditPost