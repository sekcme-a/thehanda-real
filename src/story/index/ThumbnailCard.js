
import { Card, CardContent, CardHeader, CardMedia, CardActions, IconButton, MenuItem, Menu } from "@mui/material"
import { useRouter } from "next/router"
import styles from "./ThumbnailCard.module.css"
import MenuContent from "./MenuContent"

const ThumbnailCard = ({data}) => {
  const router = useRouter()
  const {id} = router.query

  return(
    <Card sx={{p:"10px 5px",  position: "relative", height: "215px", cursor:"pointer"}}
    >

      <MenuContent storyId={data.id}/>


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
          {data.publishedAt && <h2 style={{marginTop:'3px'}}>게재일: {data.publishedAt.toDate().toLocaleString()}</h2>}
        </div>
      </CardActions>
    </Card>
  )
}

export default ThumbnailCard