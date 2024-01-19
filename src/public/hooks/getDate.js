

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
  endDate.setMonth(endDate.getMonth()+1)

  const endYYYYMM = endDate.getFullYear()*100 + endDate.getMonth()

  while (currentDate.getFullYear()*100 + currentDate.getMonth() <= endYYYYMM) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Month is zero-based
    const YYYYMM = year * 100 + month;

    result.push(YYYYMM);

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);

    // Check if the next month exceeds the endDate
    // if (currentDate > endDate && currentDate.getMonth() !== endDate.getMonth()) {
    //   break;
    // }
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
