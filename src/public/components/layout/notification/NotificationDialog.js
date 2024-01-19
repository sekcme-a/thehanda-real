
import { Button } from "@mui/material"
import styles from "./NotificationDialog.module.css"



const NotificationDialog = ({data, onClose}) => {

  return(
    <div className={styles.dialog_container}>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <div className={styles.button_container}>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
        >
          닫기
        </Button>
      </div>
    </div>
  )
}

export default NotificationDialog