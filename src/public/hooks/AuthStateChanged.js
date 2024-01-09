import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import useUserData from "context/userData";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";


export default function AuthStateChanged({ children }) {
  const {setUser, setUserData} = useUserData()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()


  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      //로그인시
      if (user !== null ) {
        db.collection("user").doc(user.uid).get().then((doc) => {
          if (doc.exists){
            setUserData(doc.data())
          }else{
            //**설정: 처음 등록한 유저일 경우 초기세팅 */
            console.log(user, user.uid)
            db.collection("user").doc(user.uid).set({
              roles: ["user"],
              photoUrl: "/images/default_avatar.png"
            })
            setUserData({
              roles: ["user"],
              photoUrl: "/images/default_avatar.png"
            })
            //**설정: 어드민 권한 없을 때 이동할 라우트 */
            router.push("/auth/hallway")
          }
          
          setIsLoading(false)
        })
      } else{
        //로그아웃시
        setUser(null)
        setUserData(null)
        setIsLoading(false)
        router.replace("/auth/login")
      }
    })
  }, []);

  if(isLoading)return <></>

  return children;
}