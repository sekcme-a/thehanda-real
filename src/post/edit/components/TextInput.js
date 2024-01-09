
import { TextField } from "@mui/material"

const TextInput = ({title, placeholder, postValues, setPostValues, id, multiline}) => {

  const onValuesChangeWithEvent = (prop) => (event) => {
    setPostValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }


  return(
    <div style={{display:"flex", alignItems:"center", margin:"10px 0"}}>
      <h1 style={{fontSize:"15px", width:"123px"}}>{title}</h1>
      <TextField size="small" placeholder={placeholder}
        value={postValues[id]} onChange={onValuesChangeWithEvent(id)}
        InputProps={{style:{fontSize:"14px"}}} fullWidth multiline={multiline}
      />
    </div>
  )
}

export default TextInput