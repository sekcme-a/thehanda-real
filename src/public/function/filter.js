
// 아무 값이나 input을 포함하는 객체배열 필터링
export const filterObjByValueFromArrayOfObj = (arrayOfObj, input) => {
  const filteredArray = arrayOfObj.filter(obj =>
    Object.values(obj).some(value => value === input || typeof value === 'string' && value.includes(input))
  );

  return filteredArray
}