import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

import styles from "./Header.module.css"
import FUNCTION from "./HeaderFunction"
import useData from "context/data"


import { FormControl, InputLabel,Select, MenuItem, TextField } from "@mui/material"
import MuiTextField from "src/public/mui/MuiTextField"
import MuiButton from "src/public/mui/MuiButton"
const Header = ({searchInput, setSearchInput, sections, selectedSection, setSelectedSection, onSearchClick}) => {
  const router = useRouter()
  const {id, type} = router.query

  const [text, setText] = useState("")


  useEffect(()=> {
    setSearchInput("")
    if(type==="programs") setText("프로그램")
    else if (type==="surveys") setText("설문조사")
    else setText("공지사항")
  },[type])


  const onChangeNameClick = () => {

  }

  const onCopyClick = () => {

  }

  const onDeleteClick = () => {

  }

  const onNewProgramClick = async() => {
    const randomDoc = await db.collection("team").doc(id).collection(type).doc().get()
    router.push(`/${id}/post/edit/${type}/${randomDoc.id}`)
  }



  return(
    <>
      <div className={styles.path_container}>
        <h1>{text}</h1>
      </div>
      
      <div className={styles.button_container}>
        <FormControl sx={{width:"200px", marginRight:"25px"}} size="small">
          <InputLabel id="simple-select-label">유형 선택</InputLabel>
          <Select
            value={selectedSection}
            label="유형 선택"
            onChange={(e)=>setSelectedSection(e.target.value)}
          >
            <MenuItem value='all' key="all">전체</MenuItem>
            {
              sections.map((item, index) => {
                return(
                  <MenuItem value={item.id} key={index} name={item.name}>{item.name}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>

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
        
        <div className={styles.main_button} onClick={onNewProgramClick}>
          + 새 {text}
        </div>
        {/* <div className={styles.button} onClick={()=>router.push(`/${id}/section/${type}`)}>
          유형 변경
        </div>
        <div className={styles.button} onClick={onChangeNameClick}>
          이름 변경
        </div>
        <div className={styles.button} onClick={onCopyClick}>
          복사
        </div> 
        <div className={styles.button} onClick={onDeleteClick}>
          삭제
        </div>  */}
      </div>
    </>
  )
}

export default Header