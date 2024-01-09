import { Card, CardContent } from "@mui/material"
import useData from "context/data"

import styles from "./UserCount.module.css"

const UserCount = ({count}) => {
  const {team} = useData()


  return(
    <Card sx={{width:"fit-content", minWidth: 250}}>
      <CardContent style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end"}}>
        <div className={styles.left}>
          <h1>{`Total users`}</h1>
          <h2>{team.teamName}</h2>
          <p>사용자 수</p>
        </div>
        <h1 className={styles.right}>{count}</h1>
      </CardContent>
    </Card>

  )
}

export default UserCount