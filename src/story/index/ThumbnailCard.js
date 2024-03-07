
import { Card, CardContent, CardHeader, CardMedia, CardActions, IconButton, MenuItem, Menu } from "@mui/material"
import { useRouter } from "next/router"
import styles from "./ThumbnailCard.module.css"

const ThumbnailCard = ({data}) => {
  const router = useRouter()
  const {id} = router.query

  return(
    <Card sx={{p:"10px 5px",  position: "relative", height: "200px", cursor:"pointer"}}
      onClick={()=>router.push(`/${id}/story/${data.id}`)}
    >

      {/* <MenuContent postId={data.id} type={type}/> */}


        <CardMedia
          component="img"
          height="140"
          image={data.imgs[0].url}
          alt={data.title}
        />

      <CardContent sx={{p: "5px 5px"}}>
        <div className={styles.content_container}>
          
          <p style={
            data.condition==="게재중" ? {color: "blue"} : {color:"#333"}
          }>
            {data.condition==="게재중" ? data.condition : "미게재"}
          </p>

          <h1>{data.title}</h1>
        </div>
      </CardContent>
      <CardActions sx={{p: "5px 5px"}}>
        <div className={styles.bottom_container}>
          <h2>마지막 변경일: {data.savedAt.toDate().toLocaleString()}</h2>
        </div>
      </CardActions>
    </Card>
  )
}

export default ThumbnailCard