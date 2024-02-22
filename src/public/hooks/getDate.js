

export const getYYYYMM = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed, so we add 1
  const day = today.getDate();

  const formattedDate = `${year}${month.toString().padStart(2, '0')}`;
  return formattedDate
}

export const getYYYYMMWithSlash = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed, so we add 1

  const formattedDate = `${year}/${month.toString().padStart(2, '0')}`;
  return formattedDate;
}

export const getYYYYMMDD = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed, so we add 1
  const day = today.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}${month}${day}`;
  return formattedDate;
}

export const getYYYYMMDDWithSlash = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed, so we add 1
  const day = today.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}/${month}/${day}`;
  return formattedDate;
}


export const getYYYYMMList = (start, end) => {
  const result = [];
  let currentDate = new Date(start);
  let endDate = new Date(end)

  const endYYYYMM = endDate.getFullYear()*100 + endDate.getMonth()+1

  let currentYYYYMM = currentDate.getFullYear()*100 + currentDate.getMonth()+1

  while (currentYYYYMM <= endYYYYMM) {

    result.push(currentYYYYMM);

    //12월이면 다음년으로
    if(currentYYYYMM%100 === 12){
      currentYYYYMM = ((currentYYYYMM/100+1)*100)+1
    }else {
      currentYYYYMM = currentYYYYMM+1
    }
  }

  return result;
}


export const getYMDFromTimestamp = (timestamp) => {
  // Firestore timestamp를 JavaScript Date 객체로 변환
  const date = timestamp.toDate();

  // 년, 월, 일 추출
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 두 자리로 표현
  const day = date.getDate().toString().padStart(2, '0'); // 일도 두 자리로 표현

  // YYYY.MM.DD 형식으로 반환
  return `${year}.${month}.${day}`;
};
