import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import styles from "src/team/teamProfile/teamProfile.module.css"
import Image from "next/image"
import DropperImage from "src/public/components/DropperImage"
import { TextField } from "@mui/material"
import { Button } from "@mui/material"
import { CircularProgress } from "@mui/material"
import { useRouter } from "next/router"
import useUserData from "context/userData"


const Profile = () => {
  const router = useRouter()
  const {id} = router.query
  const {user, userData, setUserData} = useUserData()
  const [name, setName] = useState(userData.name)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  
  // useEffect(()=> {
  //   const fetchData = async () => {

  //   }
  // },[])


  const handleTeamProfileChange = (url) => {
    db.collection("user").doc(user.uid).update({
      profile: url
    }).then(()=>{
      setUserData({...userData, profile: url})
    })
  }

  const onSubmitClick = () => {
    if(name.length>12){
      alert("닉네임은 12글자 이내여야 합니다.")
      return;
    }
    setIsSubmitting(true)
    const batch = db.batch()
    batch.update(db.collection("user").doc(user.uid),{
      name: name,
    })
    batch.commit().then(()=>{
      setUserData({...userData, name: name})
      setIsSubmitting(false)
      alert("적용되었습니다.")
    })

  }

  
  return(
    <>
      <div className={styles.main_container}>
        <div className={styles.profile_container}>
          <h1>프로필 사진</h1>
          {isImageLoading ? <CircularProgress /> :  <Image src={userData.profile || "/images/default_avatar.png"} width={150} height={150} alt="프로필"/>}

          <h1>내 프로필 사진 변경</h1>
          <DropperImage imgURL={userData.profile} setImgURL={handleTeamProfileChange} path={`content/${id}/profile/${user.uid}`} setLoading={setIsImageLoading}>
            
          </DropperImage>

          <h1>닉네임 변경</h1>
          <p style={{marginBottom:"10px"}}>*닉네임은 12글자 이내여야 합니다.</p>
          <TextField value={name} onChange={e=>setName(e.target.value)} size="small"/>
          {isSubmitting ? <CircularProgress />: <Button variant="contained" onClick={onSubmitClick} sx={{ml:"10px"}}>적용</Button>}
        </div>
      </div>
    </>
  )
}

export default Profile