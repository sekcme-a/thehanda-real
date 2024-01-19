


import { useEffect, useState } from "react"

import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"

import { Button, Checkbox, Select, MenuItem, TextField, CardContent, Switch } from "@mui/material"
import styles from "./CSVTable.module.css"
import useData from "context/data"


import { FormControl, InputLabel, Input, InputAdornment } from "@mui/material"

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { CSVDownload, CSVLink } from "react-csv";

import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Card } from "mdi-material-ui"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


/*
title: 제목.csv 추출
headers: [{key, label}, ...]
data: [{id:고유 아이디, key이름: 해당key의 데이터, key이름2: ....}]
onItemClick: 아이템을 눌렀을때 이벤트
hasCheck: 항목 선택이 있는지, false 면 및의 내용 작성필요없음
checkedList, setCheckedList: useState 써서 바로 적용
*/

const CSVTable = ({title, headers, data, onItemClick, hasCheck,  checkedList, setCheckedList}) => {
    const router = useRouter()
    const [isAllChecked, setIsAllChecked] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [isExportOnlyChecked, setIsExportOnlyChecked] = useState(false)

    const [list, setList] = useState(data)

    useEffect(() => {
      setList(data)
    },[data])

    const handleIsAllCheckChange = (e) => {
      setCheckedList(e.target.checked ? data.map(item => item.id) : []);
      
      setIsAllChecked(e.target.checked)
    }

    const onCheckChange = (e,item) => {
        if(e.target.checked && !checkedList.includes(item.id)){
            setCheckedList(prevCheckedList => ([...prevCheckedList, item.id]))
        } else if(!e.target.checked){
            const updatedList = checkedList.filter(checkedItem => checkedItem !== item.id);
            setCheckedList(updatedList);
            setIsAllChecked(false)
        }
    }

    const handleSearchInput = (value) => {
      setSearchInput(value)
      if(value===""){
        setList(data)
      } else {
        let searchResults = [];
        for (let i = 0; i < data.length; i++) {
          // 객체의 각 키를 순회하면서 검색 수행
          let dataKeys = Object.keys(data[i]);
          
          // 각 키에서 검색 수행
          for (let j = 0; j < dataKeys.length; j++) {
              // 현재 키의 값을 소문자로 변환하여 검색어와 비교
              if (data[i][dataKeys[j]].toString().toLowerCase().includes(value.toLowerCase())) {
                  // 검색어를 포함하는 경우, 결과 배열에 추가하고 루프 종료
                  searchResults.push(data[i]);
                  break;
              }
          }
        }
        setList(searchResults)
      }
    }
   
    return(
        <div className={styles.root_container}>
          <div className={styles.remote_container}>
            <FormControl sx={{ m: 1 }} letiant="standard">
              <Input
                id="standard-adornment-amount"
                value={searchInput}
                onChange={(e)=>handleSearchInput(e.target.value)}
                startAdornment={<InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>}
              />
            </FormControl>
            <Button  variant="contained" size="small" style={{backgroundColor:"rgb(0, 98, 196)" }}  sx={{ml:"10px"}}> 
              <ImportExportIcon style={{fontSize:"20px", marginRight:"4px"}}/>
              <CSVLink 
                headers={headers} 
                data={ list}
                filename={`${title}.csv`}
                target="_blank"
                style={{color:"white"}}
              >
                엑셀로 추출
              </CSVLink>
            </Button> 
            {/* <p>현재 목록에 나오는 사용자들만 추출됩니다.</p> */}

            
            {/* <div className={styles.switch_container}>
              <Switch
                size="small"
                checked={isExportOnlyChecked}
                onChange={(e)=>setIsExportOnlyChecked(e.target.checked)}
              />
              <p>{isExportOnlyChecked ? "체크된 사용자만 추출":"현재 목록에 나오는 사용자만 추출"}</p>
            </div> */}
          </div>



          <div className={styles.main_container} style={{marginTop:"10px"}}>





          <table >
              <thead>
                  <tr>
                    {hasCheck &&
                      <th className={styles.check}>
                          <Checkbox
                            checked={isAllChecked}
                            onChange={handleIsAllCheckChange}
                            style={{
                                color: isAllChecked ? 'white' : 'initial', // check color
                                '&.MuiCheckboxRoot': {
                                  backgroundColor: isAllChecked ? 'black' : 'initial', // checkbox background color
                                  borderColor: isAllChecked ? 'white' : 'initial', // checkbox border color
                                },
                              }}
                          />
                      </th>
                    }

                    {headers?.map((item, index)=>{
                        return(
                            <th key={index} className={styles.header_item}>
                                {item.label}
                            </th>
                        )
                    })}
                  
                  </tr>
              </thead>

              <tbody>
                  {list?.map((item, index)=>{
                      return(
                          <tr key={index}>
                              {hasCheck &&
                                  <td className={styles.check}>
                                      <Checkbox
                                          checked = {checkedList.includes(item.id)}
                                          onChange = {(event) => onCheckChange(event, item)}
                                          disabled = {item.deleted}
                                      />
                                  </td>
                              }
                              {headers.map((head, index2)=>{
                                  if(typeof item[head.key] === "string")
                                  return(
                                      <td key={index2} onClick={()=>onItemClick(item)}>
                                          {item[head.key]?.length>30 ? `${item[head.key].substr(0,30)}...` : item[head.key]}
                                      </td>
                                  )
                                  else return(<td key={index2}>-</td>)
                              })}
                          </tr>
                      )
                  })}
              </tbody>
          </table>
        </div>
        </div>
    )
}

export default CSVTable
