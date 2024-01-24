

import { useEffect } from "react"
import styles from "./Timeline.module.css"
import { useState } from "react"

import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import { useRouter } from "next/router"
import CSVTable from "src/public/components/CSVTable"

const Timeline = ({data}) => {
  const {fetch_program_thumbnailList, fetch_survey_thumbnailList, team } = useData()
  const router = useRouter()
  const {id} = router.query
  const [timelineList, setTimelineList] = useState([])

  const HEADERS = [
    {key:"content", label:"제목"},
    {key:"title", label:"내용"},
    {key:"createdAt", label:"날짜"}
  ]

  useEffect(() => {

    const fetchData = async () => {
      const programList = await fetch_program_thumbnailList(id)
      const surveyList = await fetch_survey_thumbnailList(id)
      const docList = await db.collection("user").doc(data.uid).collection("history").where("teamId","==",id).orderBy("createdAt", "desc").get()
      if(!docList.empty){
        const list = docList.docs.map((doc) => {

          if(doc.data().type.includes("program")){
            
            //docId 를 통해 프로그램 찾기
            const searchedPost = searchPost(programList, doc.data().docId)
            return({
              title: doc.data().type==="program_applicated" ? "프로그램 신청" : "프로그램 신청 취소",
              content: searchedPost ? searchedPost.title : "삭제된 프로그램",
              createdAt: doc.data().createdAt.toDate().toLocaleString('ko-KR').replace(/\s/g, ''),
              docId: doc.data().docId,
              type: doc.data().type
            })
          }else if(doc.data().type.includes("survey")){
            //docId 를 통해 설문조사 찾기
            const searchedPost = searchPost(surveyList, doc.data().docId)
            return({
              title: doc.data().type==="survey_applicated" ? "설문조사 작성" : "설문조사 작성 취소",
              content: searchedPost ? searchedPost.title : "삭제된 설문조사",
              createdAt: doc.data().createdAt.toDate().toLocaleString('ko-KR').replace(/\s/g, ''),
              docId: doc.data().docId,
              type: doc.data().type
            })
          } else if(doc.data().type.includes("participate")){
            
            //프로그램 참여/미참여
            const searchedPost = searchPost(programList, doc.data().docId)
            return({
              title: doc.data().condition===true ? "프로그램 참여처리" : "프로그램 불참처리",
              content: searchedPost ? searchedPost.title : "삭제된 프로그램",
              createdAt: doc.data().createdAt.toDate().toLocaleString('ko-KR').replace(/\s/g, ''),
              docId: doc.data().docId,
              type: doc.data().type
            })
          }
        }).filter(Boolean)

        setTimelineList(list)
        console.log(list)
      }
    } 

    fetchData()
  },[])

  const searchPost = (list, postId) => {
    const filteredPosts = list.filter(function(obj) {
      return obj.id === postId
    })
    if(filteredPosts.length>0){
      return filteredPosts[0]
    } else return false
  }

  const onClick = (data) => {
    if(data.type.includes("program"))
      router.push(`/${team.teamId}/post/edit/programs/${data.docId}`)
    else if(data.type.includes("survey"))
    router.push(`/${team.teamId}/post/edit/surveys/${data.docId}`)
  }

  return(
    <div className={styles.main_container}>
      <h1 style={{fontSize:'18px', fontWeight:"bold", marginBottom:"7px"}}>{data.basicProfile.realName} 유저의 어플 기록입니다.</h1>
      <p style={{fontSize:"13px",  marginBottom:"20px"}}>{team.teamName}의 기록만 나타납니다.</p>
      <CSVTable 
        title={`${data.basicProfile.realName} 유저의 어플 기록`}
        headers={HEADERS}
        data={timelineList}
        style={{width:"50%"}}
        onItemClick={onClick}
      />
    </div>
  )
}

export default Timeline