import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

import styles from "./Header.module.css"

import MuiTextField from "src/public/mui/MuiTextField"
import MuiButton from "src/public/mui/MuiButton"

const Header = ({searchInput, setSearchInput, onSearchClick}) => {
  const router = useRouter()
  const {id} = router.query



  const onNewStoryClick = async() => {
    const randomDoc = await db.collection("team").doc(id).collection("stories").doc().get()
    router.push(`/${id}/story/${randomDoc.id}`)
  }



  return(
    <>
      <div className={styles.path_container}>
        <h1>스토리</h1>
      </div>
      
      <div className={styles.button_container}>
        <MuiTextField
          template="search"
          outlined
          label=""
          placeholder="검색"
          value={searchInput}
          setValue={setSearchInput}
          sx={{mr:"10px"}}
          secondary
          onEnterPress={()=>onSearchClick(searchInput)}
        />

        <MuiButton
          small
          sx={{mr:"10px"}}
          label="검색"
          secondary
          onClick={()=>onSearchClick(searchInput)}
        />
        
        <div className={styles.main_button} onClick={onNewStoryClick}>
          + 새 스토리
        </div>
      </div>
    </>
  )
}

export default Header