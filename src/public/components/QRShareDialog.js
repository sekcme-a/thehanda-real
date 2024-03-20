import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, InputAdornment, TextField } from "@mui/material"
import { useQRCode } from "next-qrcode"



const QRShareDialog = ({isOpenDialog, setIsOpenDialog, url}) => {

  const {Canvas} = useQRCode()


  const onCopyClick = () => {
    navigator.clipboard.writeText(url)
    alert("URL이 복사되었습니다.")
  }

  return (
    <Dialog open={isOpenDialog} onClose={()=>setIsOpenDialog(false)}>
      <DialogTitle>공유하기</DialogTitle>
      <DialogContent>
        <DialogContentText>아래의 QR코드 혹은 URL을 통해 공유해보세요!</DialogContentText>
        <div style={{display:"flex", justifyContent:"center", marginTop: "10px"}}>
          <Canvas
            text={url}
            options={{
              type:"image/jpg"
            }}
          />
        </div>

        <TextField 
          sx={{mt:"20px"}}
          autoFocus
          margin="dense"
          label="프로그램 URL"
          fullWidth
          value={url}
          InputProps={{
            endAdornment: <InputAdornment position="end" style={{cursor:"pointer"}} onClick={onCopyClick}><p style={{color:"purple"}}>복사</p></InputAdornment>
          }}
        />
      </DialogContent>
    
    </Dialog>
  )
}

export default QRShareDialog