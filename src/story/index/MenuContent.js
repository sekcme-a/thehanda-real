import { Card, CardContent, CardHeader, CardMedia, CardActions, IconButton, MenuItem, Menu } from "@mui/material"
import styles from "./ThumbnailCard.module.css"
import { useEffect, useState } from "react"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ROLE_CHECK } from "src/public/hooks/RoleCheck";
import useUserData from "context/userData";
import { useRouter } from "next/router";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import ShareIcon from '@mui/icons-material/Share';


import QRShareDialog from "src/public/components/QRShareDialog";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';

import { firestore as db } from "firebase/firebase";
import { FUNCTION } from "../docId/IndexFunction";

const MenuContent = ({storyId}) => {
  const router = useRouter()
  const {id} = router.query
  const {userData} = useUserData()
  const [anchorEl, setAnchorEl] = useState(null);

  const [isOpenShareDialog, setIsOpenShareDialog] = useState(false)

  const open = Boolean(anchorEl);
  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => { 
    setAnchorEl(null);
  };


  const onDeleteClick = async () => {
    if(!ROLE_CHECK.is_over_high_admin(userData))
      alert("High 이상의 권한이 필요합니다.")
    else if(confirm("해당 게시물을 삭제하시겠습니까?")){
      await FUNCTION.delete_images_from_storage(id, storyId)
      await FUNCTION.delete_story(id, storyId)
      alert("성공적으로 삭제되었습니다.")
      router.reload()
    }
  }


  return(
    <>
      <div className={styles.menu_container}>
        <IconButton
          onClick={handleClick}
          aria-haspopup="true"
        >
          <MoreVertIcon className={styles.icon} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            
          }}
        >
          <MenuItem onClick={()=>router.push(`/${id}/story/${storyId}`)} style={{padding: "3px 20px"}}><BorderColorOutlinedIcon className={styles.menu_icon}/>편집</MenuItem>

          <MenuItem onClick={() => setIsOpenShareDialog(true) } style={{ padding: "3px 20px" }}>
            <ShareIcon className={styles.menu_icon} />공유하기
          </MenuItem>

          <MenuItem onClick={onDeleteClick} style={{padding: "3px 20px", color:"rgb(172, 1, 1)"}}><DeleteOutlineIcon className={styles.menu_icon}/>삭제</MenuItem>

          <QRShareDialog isOpenDialog={isOpenShareDialog} setIsOpenDialog={setIsOpenShareDialog} url={`https://thehanda-share.netlify.com/story/${id}/${storyId}`} />
        </Menu>
      </div>
    </>
  )
}

export default MenuContent