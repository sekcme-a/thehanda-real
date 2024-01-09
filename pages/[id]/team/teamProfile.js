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


const TeamProfile = () => {
  const router = useRouter()
  const {id} = router.query
  const {team, setTeam} = useData()
  const [teamName, setTeamName] = useState(team.teamName)
  const [profile, setProfile] = useState(team.profile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)


  const handleTeamProfileChange = (url) => {
    db.collection("team").doc(id).update({
      profile: url
    }).then(()=>{
      setProfile(url)
      setTeam({...team, profile: url})
    })
  }

  const onSubmitClick = () => {
    if(teamName.length>12){
      alert("팀명은 12글자 이내여야 합니다.")
      return;
    }
    setIsSubmitting(true)
    const batch = db.batch()
    batch.update(db.collection("team").doc(id),{
      teamName: teamName,
      profile: profile
    })
    batch.commit().then(()=>{
      setTeam({...team, profile: profile, teamName: teamName})
      setIsSubmitting(false)
      alert("적용되었습니다.")
    })

  }

  
  return(
    <>
      <div className={styles.main_container}>
        <div className={styles.profile_container}>
          <h1>현재 프로필 사진</h1>
          {isImageLoading ? <CircularProgress /> :  <Image src={team.profile} width={150} height={150} alt="팀 프로필"/>}

          <h1>팀 프로필 사진 변경</h1>
          <p>*가로 세로 사이즈가 동일한 정사각형 이미지 사용을 권장합니다.</p>
          <DropperImage imgURL={team.profile} setImgURL={handleTeamProfileChange} path={`content/${id}/profile`} setLoading={setIsImageLoading}>
            
          </DropperImage>

          <h1>팀명 변경</h1>
          <p style={{marginBottom:"10px"}}>*팀명은 12글자 이내여야 합니다.</p>
          <TextField value={teamName} onChange={e=>setTeamName(e.target.value)} size="small"/>
          {isSubmitting ? <CircularProgress />: <Button variant="contained" onClick={onSubmitClick} sx={{ml:"10px"}}>적용</Button>}
        </div>
      </div>
    </>
  )
}

export default TeamProfile