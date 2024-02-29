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
import {FUNCTION} from "./MenuContentFunction"
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';

const MenuContent = ({postId, type}) => {
  const router = useRouter()
  const {id} = router.query
  const {userData} = useUserData()
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => { 
    setAnchorEl(null);
  };


  const onCopyClick = async () => {
    if(confirm("해당 게시물을 복사하시겠습니까?")){
      const res = await FUNCTION.copyPost(id, type, postId)
      if(res){
        alert("성공적으로 복사되었습니다.")
        router.reload()
      } else alert("에러가 발생했습니다.")
    }
  }

  const onResultClick = () => {
    router.push(`/${id}/result/${type}/${postId}`)
  }


  const onDeleteClick = async () => {
    if(!ROLE_CHECK.is_over_high_admin(userData))
      alert("High 이상의 권한이 필요합니다.")
    else if(confirm("해당 게시물을 삭제하시겠습니까?\n일방적인 게재 취소는 사용자들에게 혼란을 줄 수 있습니다.")){
      await FUNCTION.deletePost(id, type, postId)
      alert("성공적으로 삭제되었습니다.")
      router.reload()
    }
  }

  const onOpenClick = () => {
    router.push(`/${id}/post/edit/${type}/${postId}`)
  }

  const onCodeClick = () => {
    navigator.clipboard.writeText(postId)
    alert(`코드가 복사되었습니다.\n알림을 보낼 때 해당 코드를 붙여넣기하여 알림을 보내보세요.`)
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
          <MenuItem onClick={onOpenClick} style={{padding: "3px 20px"}}><BorderColorOutlinedIcon className={styles.menu_icon}/>편집</MenuItem>
          <MenuItem onClick={onCopyClick} style={{padding: "3px 20px"}}><ContentCopyIcon className={styles.menu_icon}/>복사</MenuItem>
          {type!=="announcements" && 
            <MenuItem onClick={onResultClick} style={{padding: "3px 20px"}}><ListAltIcon className={styles.menu_icon}/>결과보기</MenuItem>
          }
          {type!=="announcements" && 
            <MenuItem onClick={onCodeClick} style={{padding: "3px 20px"}}><DifferenceOutlinedIcon className={styles.menu_icon}/>코드 복사</MenuItem>
          }

          {type !== "announcements" && type !== "surveys" && (
              <MenuItem onClick={() => router.push(`/${id}/comment/${postId}`)} style={{ padding: "3px 20px" }}>
                <DriveFileRenameOutlineIcon className={styles.menu_icon} />프로그램 후기 작성
              </MenuItem>
          )}
          {type !== "announcements" && type !== "surveys" && (
              <MenuItem onClick={() => router.push(`/${id}/result/comments/${postId}`)} style={{ padding: "3px 20px" }}>
                <ListAltIcon className={styles.menu_icon} />후기 결과보기
              </MenuItem>
          )}

          <MenuItem onClick={onDeleteClick} style={{padding: "3px 20px", color:"rgb(172, 1, 1)"}}><DeleteOutlineIcon className={styles.menu_icon}/>삭제</MenuItem>
        </Menu>
      </div>
    </>
  )
}

export default MenuContent