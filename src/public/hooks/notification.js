import axios from "axios";
import { firestore as db } from "firebase/firebase";
import { checkIsValidPoint, usePoint } from "./handlePoints";
import useData from "context/data";

export const sendNotification = (uid, title, message, type, data) => {
  return new Promise(async (resolve, reject) => {



    let canSend = false

    //해당 유저가 존재하며, 알림 토큰와 설정등을 확인
      if(!uid || uid===""){
        reject({uid: uid, title:"전송 실패", text:"uid를 입력하지 않으셨습니다."}); return;
      }
      else if(!type || type===""){
        reject({uid: uid, title:"전송 실패", text:"타입을 입력하지 않으셨습니다."}); return;
      }
      const userDoc = await db.collection("user").doc(uid).get()
      if(userDoc.exists){
        console.log(userDoc.data())
        if(userDoc.data().pushToken==="" || !userDoc.data().pushToken)
          reject({uid: uid, title: "전송 실패", text: `해당 유저의 전송 토큰을 조회할 수 없습니다. 해당 유저가 알림 권한을 차단했을 가능성이 높습니다.`})
        else if(!userDoc.data()[type])
          reject({uid: uid, title: "전송 실패", text: `해당 유저가 알림 설정이 꺼진 상태입니다.`})
        else {
          canSend = true
        }
      }else {
        reject({uid: uid, title:"전송 실패", text: `해당 유저를 찾을 수 없습니다.`})
      }

    const token = userDoc.data().pushToken

    if(canSend){
      try {
        const response = await axios.post('/api/notification', {
          token: token
        });
        await fetch('/api/notification',{
          method:"POST",
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({...{token, title, message, data}})
        });
        resolve({uid: uid, title:"전송 성공", text:`알림을 성공적으로 전송했습니다.` , response: response});
      } catch (error) {
        reject(error);
      }
    }
  });
}

export const sendMultipleNotification = (uidList, title, message, type, data, teamId, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(teamId)
      //모든 sendMulitple 함수에 teamId 붙힌 후엔 if(teamId) 삭제
      if(teamId){
        const result1 = await checkIsValidPoint(teamId, uidList.length)
        if(result1==="not enough points"){
          reject( "not enough points")
          return
        } else if(result1==="denied"){
          reject("denied")
          return
        } else if( result1==="no point data"){
          reject("no point data")
          return
        }
      }


      const result = await Promise.all(uidList.map(async (uid) => {
        try {
          const res = await sendNotification(uid, title, message, type, data);
          return res;
        } catch (e) {
          return e;
        }
      }));

      if(teamId) {
        let count = 0
        result.map((res) => {
          if(res.title==="전송 성공") count++
        })
        await usePoint(teamId, title, name, count)
      }
      console.log(result)
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
