import { Card, CardContent, CardHeader, CardMedia, CardActions, IconButton, MenuItem, Menu } from "@mui/material"
import styles from "./ThumbnailCard.module.css"
import { useEffect, useState } from "react"
import MoreVertIcon from '@mui/icons-material/MoreVert';

import MenuContent from "./MenuContent"
import { useRouter } from "next/router";

const ThumbnailCard = ({data, type}) => {
  const router = useRouter()
  const {id} = router.query
  const [conditionText, setConditionText] = useState("")



  useEffect(()=>{
    if(data.condition==="confirm") setConditionText("게재중")
    else if(data.condition==="unconfirm") setConditionText("미게재")
    else if(data.condition==="decline") setConditionText("승인거절")
    else if(data.condition==="waitingForConfirm") setConditionText("승인대기")
  },[data.condition])


  

  return(
    // <div className={styles.main_container}>
    //   <img src={data.thumbnailURL} alt={data.title} />
    // </div>
    <Card sx={{p:"10px 5px",  position: "relative", height:"215px", cursor:"pointer"}}>

      <MenuContent postId={data.id} type={type}/>

      {type==="announcements" ? 
        <>
        
        </>
        :
        <CardMedia
          onClick={()=>router.push(`/${id}/post/edit/${type}/${data.id}`)}
          component="img"
          height="140"
          image={data.thumbnailURL}
          alt={data.title}
        />
      }

      <CardContent sx={{p: "5px 5px"}} onClick={()=>router.push(`/${id}/post/edit/${type}/${data.id}`)}>
        <div className={styles.content_container}>
          <p style={conditionText==="승인거절" ? {color:"red"}: 
            conditionText==="게재중" ? {color: "blue"} : 
            {color:"#333"}
          }>{conditionText}</p>
          <h1>{data.title}</h1>
        </div>
      </CardContent>
      <CardActions sx={{p: "5px 5px"}} onClick={()=>router.push(`/${id}/post/edit/${type}/${data.id}`)}>
        <div className={styles.bottom_container}>
          <h2>마지막 변경일: {data.savedAt.toDate().toLocaleString()}</h2>
        </div>
      </CardActions>
    </Card>
  )
}

export default ThumbnailCard