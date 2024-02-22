const { Button, CircularProgress } = require("@mui/material")



/*
label : 버튼 내의 글씨
isLoading: 로딩시엔 disabled, 로딩중 아이콘 표시

*/
const MuiButton = ({
  contained, outlined, text,
  small, medium, large,
  primary, secondary, error, info, warning, success,
  fullWidth,
  onClick,
  disabled,
  labelIcon, 
  label="label",
  isLoading,
  style,
  sx
}) => {

  return(
    <Button
      variant={text ? "text" : outlined ? "outlined" : "contained"}
      size={medium ? "medium" : large ? "large" : "small"}
      color={secondary ? "secondary" : error ? "error" : info ? "info" : warning ? "warning" : success ? "success" : "primary"}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={style}
      sx={sx}
      
    >
      {isLoading && <CircularProgress style={{ width: "20px", height: "20px", padding:"2px"}}/>}
      
      {!isLoading &&
        labelIcon ? 
        <>
          {labelIcon} {label}
        </>
        :
        label
      }
    </Button>
  )
}

export default MuiButton