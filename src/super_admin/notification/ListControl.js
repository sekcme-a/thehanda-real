import { Button, Dialog, TextField } from "@mui/material"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

const ListControl = () => {
  const router = useRouter()


  const onAddClick = async() => {
    const randomDoc = await db.collection("admin_notification").doc().get()
    router.push(`/super_admin/notification/${randomDoc.id}`)
  }


  return(
    <div>
      <Button
        margin="dense"
        size="small"
        variant="contained"
        onClick={onAddClick}
      >공지 추가 +</Button>
    
    </div>
  )
}

export default ListControl