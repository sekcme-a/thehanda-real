import MuiTextField from "src/public/mui/MuiTextField"
import CommerceCard from "src/super_admin/commerce/CommerceCard"

import { useEffect, useState } from "react"
import MuiButton from "src/public/mui/MuiButton"
import { useRouter } from "next/router"
import useData from "context/data"

import { firestore as db } from "firebase/firebase"

const COMMERCIAL_DATA = [
  { id: "home_swiper_1", title: "홈 상단 배너1", ratio: "18:9" },
  { id: "home_swiper_2", title: "홈 상단 배너2", ratio: "18:9" },
  { id: "home_swiper_3", title: "홈 상단 배너3", ratio: "18:9"},
  { id: "home_body_banner", title:"홈 중간부분(컨텐츠, 최근본프로그램 사이) 배너", ratio:"5:1"},
  { id: "mypage_body_banner", title:"마이페이지 배너", ratio:"5:1"},
]
const Admin = () => {

  const router = useRouter()

  const [commercial, setCommercial] = useState({})

  const [input, setInput] = useState("")

  useEffect(()=> {

    const fetchData = async () => {
      const doc = await  db.collection("commercial").doc("app").get()
      setCommercial({...doc.data()})
    }
    fetchData()
    
  },[])

  return(
    <div style={{padding: "40px"}}>
      <MuiButton
        onClick={()=>router.back()}
        label="< 뒤로가기"
      />
      <MuiTextField
        label="검색"
        value={input}
        fullWidth
        setValue={setInput}
        sx={{mb:"50px", mt:"20px"}}
      />
      {COMMERCIAL_DATA.map((item, index) => {
        if(input==="" || item.title.includes(input)) return(
          <CommerceCard {...{...item}} key={index} data={commercial[item.id]} setCommercial={setCommercial} mode="app"/>
        )
      })}
    
    </div>
  )
}

export default Admin