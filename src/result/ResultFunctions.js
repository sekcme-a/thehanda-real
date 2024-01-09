import { firestore as db } from "firebase/firebase"
import { DatabaseCogOutline } from "mdi-material-ui";
import { sendMultipleNotification, sendNotification } from "src/public/hooks/notification";

export const fetch_header_data_and_title = async (teamId, type, docId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await db.collection("team").doc(teamId).collection(type).doc(docId).get();

      if (doc.exists && doc.data().formData) {

        const formData = doc.data().formData.map((item) => (
          {key: item.id, label: item.title}
        ))
        resolve({title: doc.data().title, headerData: [{key:"realName", label:"실명(프로필 상)"}, {key:"phoneNumber", label:"전화번호(프로필 상)"},{key:"confirmed", label:"참여 승인"},  ...formData]})
      } else {
        reject("존재하지 않는 게시물입니다.");
      }
    } catch (error) {
      reject(error.message);
    }
  });
}

export const fetch_result_data = async (teamId, type, docId) => {{
  return new Promise(async(resolve, reject) => {
    try{
      //type 가 programs 등 인데, program으로 들어가야되서 substinrg 씀;;
      const query = await db.collection("team_admin").doc(teamId).collection(type.substring(0,type.length-1)).doc(docId).collection("result").orderBy("createdAt","desc").get()

      if(query.empty) resolve([])
      else{
        const result = await Promise.all(query.docs.map(async (doc) => {
          const userDoc = await db.collection("user").doc(doc.id).get();
          const basicProfile = userDoc.exists && userDoc.data().basicProfile;
        
          return {
            id: doc.id,
            ...doc.data(),
            confirmed: doc.data().confirmed ? "승인" : "미승인",
            realName: basicProfile?.realName || "삭제된 유저",
            phoneNumber: basicProfile?.phoneNumber || "삭제된 유저",
            deleted: basicProfile ? false : true
          };
        }));
        resolve(result)
      }

    }catch(e){
      reject(e.message)
    }
  })
}}

export const refine_result_data = (data) => {
  try{
    const refinedData = data.map((obj, index) => {
      for(let[key, value] of Object.entries(obj)){
        
        //다중선택 핸들
        if(Array.isArray(value)){
          obj[key] = value.join(",")
        }
        else if(value.main && value.sub){ //주소 핸들
          obj[key] = `${value.main} ${value.sub}`
        }
      }
      return obj
    })
    return refinedData
  }catch(e){
    console.log(e.message)
    return false
  }
}

export const confirm_users = async (title, teamId, type, docId, uidList, isSendAlarm) => {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = db.batch();
      let sendMessageUidList = []

      await Promise.all(uidList.map(async (uid) => {
        const resultDocRef = db.collection("team_admin").doc(teamId).collection(type.substring(0,type.length-1)).doc(docId).collection("result").doc(uid);
        batch.update(resultDocRef, { confirmed: true });

        const userDocRef = db.collection("user").doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          if(!userDoc.data().confirmedPrograms?.includes(docId)){
            //이미 승인된 유저들을 제외한 유저들만 업데이트 및 알림 보내기.
            batch.update(userDocRef, { 
              confirmedPrograms: userDoc.data().confirmedPrograms ? [docId, ...userDoc.data().confirmedPrograms] : [docId]
            });
            batch.set(userDocRef.collection("alarm").doc(),{
              createdAt: new Date(),
              mode: "programConfirmed",
              read: false,
              type:"[참여 확정]",
              title: `${title}`,
              text: `${title} 프로그램의 참여가 확정되었습니다! 신청한 프로그램, 내 일정 등에서도 해당 프로그램 확인하실 수 있습니다!`
            })
            if( isSendAlarm ){
              sendMessageUidList.push(uid)
            }
          }
        }
      }));

      await batch.commit();
      await sendMultipleNotification(sendMessageUidList, "프로그램 참여 확정!", `${title} 프로그램의 참여가 확정되었습니다!`, 'alarm_program')
      resolve("Success");

    } catch (e) {
      console.log(e)
      reject(e.message);
    }
  });
};


export const participate_users = async (teamId, type, docId, checkedList, isParticipated) => {
  return new Promise( async (resolve, reject) => {
    try{
      const batch = db.batch()
      await Promise.all(checkedList.map( async (uid) => {
          const resultDocRef = db.collection("team_admin").doc(teamId).collection(type.substring(0,type.length-1)).doc(docId).collection("result").doc(uid);
          batch.update(resultDocRef, { participated: isParticipated });

          //history 에 이미 해당 프로그램의 참여유무가 있다면, 해당 참여유무 삭제 후 생성
          const historyQuery = await db.collection("user").doc(uid).collection("history").where("docId","==", docId).where("type","==", "participate").get()
          if(!historyQuery.empty){
            await Promise.all(historyQuery.docs.map((doc) => {
              batch.delete(db.collection("user").doc(uid).collection("history").doc(doc.id))
            }))
          }
          batch.set(db.collection("user").doc(uid).collection("history").doc(),{
            createdAt: new Date(),
            type: "participate",
            docId: docId,
            condition: isParticipated,
          })
        })
      )
      await batch.commit()
      resolve("success")
    }catch(e){
      console.log(e)
      reject(e.message)
    }
  })
}