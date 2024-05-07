import { TextField, InputAdornment } from "@mui/material"
import { useEffect } from "react"


import SearchIcon from '@mui/icons-material/Search';

const MuiTextField = ({
  //design option
  label="label", sx={}, required, multiline, maxRows, rows, margin, dense, fullWidth,color, 
  placeholder, helperText,
  standard, filled, outlined, //standard for default

  //textfield size
  small, medium, large, //small for default
  //color
  primary, secondary, info, warning, success,

  value, setValue, //required
  handleChange, //use handleChange if using custom input, not useState

  template, // kg, search, cm
  startAdornment, endAdornment, //component that you want to put in start||end of the textfield


  id, //required if using error (to specify which textfield has error)
  error, //required if using error error={id:"ID", text: "error message"}

  handleKeyPress, //handleKeyPress(key) => {} if you wan't to handle key press during focus on textfield
  onEnterPress, //엔터키는 자주 사용됨으로 따로 빼놓음

}) => {



  const onValueChange = (changedValue) => {
    if(handleChange)
      handleChange(changedValue)
    else
      setValue(changedValue)
  }

  const onKeyPress = (e) => {
    if(e.key === "Enter" && onEnterPress) {
      onEnterPress()
    }else if(handleKeyPress) {
      handleKeyPress(e.key)
    }
  }

  return(
    <TextField
      variant={outlined ? "outlined" : filled ? "filled" : "standard"}
      {...{label, sx, required, multiline, maxRows, rows,fullWidth, placeholder, color}}
      margin={margin ? margin : dense ? "dense" : "normal"}

      size={medium? "medium" : large ? "large" : "small"}
      color={secondary ? "secondary" : info ? "info" : warning ? "warning" : success ? "success" : "primary"}

      InputProps={{
        ...(startAdornment && { startAdornment: <InputAdornment position="start">{startAdornment()}</InputAdornment> }),
        ...(endAdornment && { endAdornment: <InputAdornment position="end">{endAdornment()}</InputAdornment> }),
        ...(template==="kg" && {startAdornment: <InputAdornment position="start">kg</InputAdornment>}),
        ...(template==="cm" && {startAdornment: <InputAdornment position="start">cm</InputAdornment>}),
        ...(template==="search" && {startAdornment: <InputAdornment position="start"><SearchIcon sx={{fontSize:"20px", color:"black"}}/></InputAdornment>}),
      }}

      value={value}
      onChange = {(e) => onValueChange(e.target.value)}

      error={error && error.id===id}
      helperText = {helperText || error && error.id===id && error.text}

      onKeyPress={onKeyPress}
    />
  )
}

export default MuiTextField