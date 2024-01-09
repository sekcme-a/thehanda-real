import  { Grid, Card, CardContent, CardActions, Button, Dialog } from "@mui/material"


import styles from "./GroupCard.module.css"
import { useState } from "react"

import GroupDetailsDialog from "./GroupDetailsDialog"


const GroupCard = ({key, data}) => {

  const [isOpenDialog, setIsOpenDialog] = useState(false)

  return(
    <>
    <Grid item xs={12} sm={6} md={4} key={key}>
      <Card className={styles.card}>
        <CardContent>
          <h1>{data.name}</h1>
          <h2>{data.explain}</h2>
          <h3>{`최초 생성일: ${data.createdAt.toDate().toLocaleString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          })}`}
          </h3>
          <h4>생성자: {data.author}</h4>
        </CardContent>
        <CardActions>
          <div className={styles.button_container}>
            <Button
              size="small"
              onClick={()=>setIsOpenDialog(true)}
            >
              자세히 보기
            </Button>
          </div>
        </CardActions>
      </Card>
    </Grid>

    <GroupDetailsDialog {...{isOpenDialog, setIsOpenDialog}} groupData={data} />
    </>
  )
}

export default GroupCard