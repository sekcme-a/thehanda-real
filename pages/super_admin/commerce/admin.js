import MuiTextField from "src/public/mui/MuiTextField"
import CommerceCard from "src/super_admin/commerce/CommerceCard"

import { useEffect, useState } from "react"
import MuiButton from "src/public/mui/MuiButton"
import { useRouter } from "next/router"
import useData from "context/data"


const COMMERCIAL_DATA = [
  { id: "dashboard_main", title: "대쉬보드 상단광고", ratio: "18:5" },
]
const Admin = () => {
  const {commercial, setCommercial} = useData()

  const router = useRouter()

  const [input, setInput] = useState("")


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
          <CommerceCard {...{...item}} key={index} data={commercial[item.id]} setData={setCommercial} mode="admin"/>
        )
      })}
    
    </div>
  )
}

export default Admin