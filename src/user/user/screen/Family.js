
import { useEffect } from "react"
import styles from "./Family.module.css"

import { firestore as db } from "firebase/firebase"
import useUserData from "context/userData"
import { useState } from "react"
import { Card, CardContent, Grid } from "@mui/material"
import { HomeFloor3 } from "mdi-material-ui"

const Family = ({data}) => {


  const [familyList, setFamilyList] = useState([])

  useEffect(() => {

    const fetchData = async () => {
      const querySnapshot = await db.collection("user").doc(data.uid).collection("family").get()

      if(!querySnapshot.empty) {
        const list = querySnapshot.docs.map((doc) => {
          return({id: doc.id, ...doc.data()})
        })
        setFamilyList(list)
      }
    }

    fetchData()
  },[])

  return(
    <div className={styles.main_container}>
      {familyList.length===0 &&
        <p className={styles.empty}>유저가 등록한 가족구성원이 없습니다.</p>
      }
      <Grid container rowSpacing={2} columnSpacing={2}>
        {familyList.map((item, index) => (
          <Grid item key={index} xs={12} sm={6}  className={styles.card}>
            <Card>
              <CardContent>
                <h1>{`[${item.relation}]`}</h1>
                <h2><strong>성명: </strong>{item.realName}</h2>
                <h3><strong>전화번호: </strong>{item.phoneNumber}</h3>
                <h3><strong>국적: </strong>{item.country.flag} {item.country.text}</h3>
                <h3><strong>성별: </strong>{item.gender==="male" ? "남자" : item.gender==="female" ? "여자" : "기타"}</h3>
                <h3><strong>생년월일: </strong>{item.birth.toDate().toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}</h3>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Family