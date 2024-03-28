import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

import styles from "./Header.module.css"


import { FormControl, InputLabel,Select, MenuItem, TextField } from "@mui/material"
import MuiTextField from "src/public/mui/MuiTextField"
import MuiButton from "src/public/mui/MuiButton"
const Header = ({searchInput, setSearchInput, sections, selectedSection, setSelectedSection, onSearchClick, filterType, setFilterType}) => {
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


  const filterSelect = [
    {
      name:"전체",
      id:'전체',
    },
    {
      name:"게재중 프로그램",
      id:"게재중",
    },
    {
      name:"미게재 프로그램",
      id:"미게재",
    },
    {
      name:"예약접수 프로그램",
      id:"예약접수",
    },
    {
      name:"접수중(미마감) 프로그램",
      id:"접수중",
    },
    {
      name:"마감된 프로그램",
      id:"마감",
    }
  ]


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

        <FormControl sx={{width:"200px", marginRight:"25px"}} size="small">
          <InputLabel id="simple-select-label">필터링</InputLabel>
          <Select
            value={filterType}
            label="유형 선택"
            onChange={(e)=>setFilterType(e.target.value)}
          >
            {
              filterSelect.map((item, index) => {
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
          label="키워드 검색"
          placeholder="키워드를 통해 검색됩니다."
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