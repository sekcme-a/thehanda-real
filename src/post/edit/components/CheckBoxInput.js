import { Checkbox } from "@mui/material"
import { useEffect } from "react"


const CheckBoxInput = ({mode, postValues, setPostValues}) => {

  //handle 등급(isMain)
  const onIsMainChange = (e) => {
    setPostValues(prevValues => ({...prevValues, ["isMain"]: e.target.checked}))
  }
  const onIsCommonChange = (e) => {
    setPostValues(prevValues => ({...prevValues, ["isMain"]: !e.target.checked}))
  }



  //handle Type
  const onTypeChange = (checked, target) => {
    if(checked)
    setPostValues(prevValues => ({...prevValues, type: target}))
    else if(target==="common"){
      alert("타입은 없을 수 없습니다.")
    } else
      setPostValues(prevValues => ({...prevValues, type: target}))
  }

  useEffect(()=>{
    console.log(postValues)
  },[postValues])


  if(mode==="isMain")
    return(
      <>
        <div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={postValues.isMain}
            onChange={onIsMainChange}
          />
          <p>메인 프로그램</p>
        </div>

        <div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={!postValues.isMain}
            onChange={onIsCommonChange}
          />
          <p>일반 프로그램</p>
        </div>
      </>
    )

  else if (mode==="type")
    return(
      <>
        <div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={postValues.type==="common"}
            onChange={(e)=>onTypeChange(e.target.checked, "common")}
          />
          <p>일반</p>
        </div>

        <div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={postValues.type==="children"}
            onChange={(e)=>onTypeChange(e.target.checked, "children")}
          />
          <p>자녀</p>
        </div>
      </>
    )

  else if (mode==="condition")
    return(
      <>

<div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={postValues.condition==="confirm"}
          />
          <p>승인됨</p>
        </div>
        <div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={postValues.condition==="waitingForConfirm"}
          />
          <p>승인대기</p>
        </div>
        <div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={postValues.condition==="unconfirm"}
          />
          <p>미승인</p>
        </div>
        <div style={CHECKBOXSTYLE}>
          <Checkbox
            size="small"
            style={{paddingRight:"4px"}}
            checked={postValues.condition==="decline"}
          />
          <p>반려</p>
        </div>
      </>
    )
}

const CHECKBOXSTYLE = {
  display:"flex",
  alignItems:"center",
  marginRight:"15px"
}

export default CheckBoxInput