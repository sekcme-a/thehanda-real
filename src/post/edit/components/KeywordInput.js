
import { TextField } from "@mui/material"
import { useEffect, useState } from "react"
import MuiButton from "src/public/mui/MuiButton"

const KeywordInput = ({title, placeholder, postValues, setPostValues, id, multiline, autoCreateFor}) => {

  const [value, setValue] = useState("")

  useEffect(() => {
    if(postValues[id]?.length>0){
      const temp = postValues[id]
      setValue(temp.join(''))
    }
  },[postValues.keyword])

  const onValuesChangeWithEvent = (prop) => (event) => {
    const stringToArray = event.target.value.split(",")
    setPostValues(prevValues => ({...prevValues, [prop]: stringToArray}))
  }


  const onAutoCreateClick = () => {
    if(!autoCreateFor || autoCreateFor==="") alert("제목을 작성해야 자동생성됩니다.")
    else {
      const prevWords = postValues[id]
      const autoCreatedWords = autoCreateFor.split(/[\s!@#$%^&*()\-_=+[{\]};:'",.<>/?]+/);
      setPostValues(prevValues => ({...prevValues, [id]: [...prevWords,...autoCreatedWords]}))
    }
  }

  return(
    <>
    <div style={{display:"flex", alignItems:"center", margin:"10px 0"}}>
      <h1 style={{fontSize:"15px", width:"137px"}}>{title}</h1>
      <TextField size="small" placeholder={placeholder}
        value={postValues[id]} onChange={onValuesChangeWithEvent(id)}
        InputProps={{style:{fontSize:"14px"}}} fullWidth multiline={multiline}
        
      />
      <MuiButton
        label="자동 생성"
        onClick={onAutoCreateClick}
        style={{width:"100px", marginLeft:"10px"}}
      />
    </div>

    </>
  )
}

export default KeywordInput