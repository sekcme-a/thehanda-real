import { useEffect, useState } from "react"

import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"

import { Button, Checkbox, Select, MenuItem } from "@mui/material"
import styles from "./CSVTable.module.css"
import useData from "context/data"


import { FormControl, InputLabel } from "@mui/material"

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { CSVDownload, CSVLink } from "react-csv";

import ImportExportIcon from '@mui/icons-material/ImportExport';



/*
title: 제목.csv 추출
headers: [{key, label}, ...]
data: [{id:고유 아이디, key이름: 해당key의 데이터, key이름2: ....}]
type: type===program 이면 체크 표시등이 있음
checkedList, setCheckedList: useState 써서 바로 적용
*/

const CSVTable = ({title, headers, data, type, docId, isChildrenMode, checkedList, setCheckedList, noFilter}) => {
    const router = useRouter()
    const {id} = router.query
    // const {teamId} = useData()
    const [isLoading, setIsLoading] = useState(false)
    const [rowData, setRowData] = useState([])
    const [triggerReload, setTriggerReload] = useState(true)
    const [isAllCheck, setIsAllCheck] = useState(false)

    const [filter, setFilter] = useState("all")

    const [sortedList, setSortedList] = useState([])


    useEffect(() => {
        setIsAllCheck(false)

        let tempList = data
        if (filter === "confirmedOnly")
            tempList = tempList.filter(item => item.confirmed === "승인")
        if (filter === "unconfirmedOnly")
            tempList = tempList.filter(item => item.confirmed !== "승인")
        else if (filter ==="participatedOnly")
            tempList = tempList.filter(item => item.participated === "참여")
        else if (filter ==="unparticipatedOnly")
            tempList = tempList.filter(item => item.participated !== "참여")

        setSortedList(tempList)

    },[data, filter])


    const onUidClick = (uid)=>{
        router.push(`/${id}/user/${uid}`)
    }

    const onYesClick = async(uid, hasPart)=>{
     
    }

    const onNoClick = async(uid, hasPart) => {
 
    }

    const onCheckChange = (e,item) => {
        if(e.target.checked && !checkedList.includes(item.id)){
            setCheckedList(prevCheckedList => ([...prevCheckedList, item.id]))
        } else if(!e.target.checked){
            const updatedList = checkedList.filter(checkedItem => checkedItem !== item.id);
            setCheckedList(updatedList);
        }
    }
    
    const handleIsAllCheckChange = (e) => {
        setIsAllCheck(e.target.checked)
        if(e.target.checked){
            const idList = sortedList.map((item) => {
                if(!item.deleted) return item.id
            }).filter(Boolean)
            setCheckedList(idList)
        } else {
            setCheckedList([])
        }
    }

    if(isLoading)
    return<></>

    
    return(
        <>
        <div style={{display:"flex", alignItems:"center", flexWrap:"wrap"}}>
            {!noFilter &&
                <FormControl  size='small' style={{minWidth:"150px", backgroundColor:"white"}}>
                    <InputLabel id="simple-select-label" size='small'>필터</InputLabel>
                    <Select
                    value={filter}
                    label="제목"
                    size='small'
                    onChange={(e) => setFilter(e.target.value)}
                    >
                        <MenuItem value="all" size='small'>전체</MenuItem>
                        <MenuItem value="confirmedOnly" size='small'>신청 승인만</MenuItem>
                        <MenuItem value="unconfirmedOnly" size='small'>참여 미승인만</MenuItem>
                        <MenuItem value="participatedOnly" size='small'>참여한 사용자만</MenuItem>
                        <MenuItem value="unparticipatedOnly" size='small'>불참 사용자만</MenuItem>
                    </Select>
                </FormControl>
            }
            <Button  variant="contained" size="small" style={{backgroundColor:"rgb(0, 98, 196)" }}  sx={{ml:"10px"}}> 
            <ImportExportIcon style={{fontSize:"20px", marginRight:"4px"}}/>
            <CSVLink 
                headers={headers} 
                data={sortedList} 
                filename={`${title}.csv`}
                target="_blank"
                style={{color:"white"}}
            >
                엑셀로 추출
            </CSVLink>
            </Button> 
        </div>

        <div className={styles.main_container} style={{marginTop:"10px"}}>

            <table>
                <thead>
                    <tr>
                        {type==="programs" &&
                            <th >
                                <Checkbox
                                    checked={isAllCheck}
                                    onChange={handleIsAllCheckChange}
                                    style={{
                                        color: isAllCheck ? 'white' : 'initial', // check color
                                        '&.MuiCheckboxRoot': {
                                          backgroundColor: isAllCheck ? 'black' : 'initial', // checkbox background color
                                          borderColor: isAllCheck ? 'white' : 'initial', // checkbox border color
                                        },
                                      }}
                                />
                            </th>
                        }

                        {headers?.map((item, index)=>{
                            return(
                                <th key={index} className={styles.header_item} style={type!=="programs" ?{padding: "10px"} : {}}>
                                    {item.label}
                                </th>
                            )
                        })}
                   
                    </tr>
                </thead>

                <tbody>
                    {sortedList?.map((item, index)=>{
                        return(
                            <tr key={index}>
                                {type==="programs" &&
                                    <td>
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
                                        <td key={index2} onClick={()=>onUidClick(item.id)}
                                         style={item[head.key]==="불참" ||item[head.key]==="미승인" ? {color:'red'} :
                                         item[head.key]==="참여" ||item[head.key]==="승인" ? {color:'blue'} :{}}
                                        >
                                            {item[head.key]?.length>30 ? `${item[head.key].substr(0,30)}...` : item[head.key]}
                                        </td>
                                    )
                                    else return(<td key={index2}>-</td>)
                                })}
                                   {/* {type==="programs" && !isChildrenMode ? 
                                    <td className={styles.part_container}>
                                        {console.log(item)}
                                        {item.hasPart===true && <h1><CheckCircleOutlineIcon /> 참여함</h1>}
                                        {item.hasPart===false && <h2><CancelOutlinedIcon /> 미참여</h2>}
                                        {item.hasPart!==undefined && <p>|</p>}
                                        <Button disabled={item.hasPart===true} onClick={()=>onYesClick(item.uid, item.hasPart)}>참여함</Button>
                                        <Button style={item.hasPart===true ?{color:"red"} : {}} disabled={item.hasPart===false} onClick={()=>onNoClick(item.uid, item.hasPart)}>미참여</Button>
                                    </td>
                                    :
                                    type==="programs" && item.relation==="신청자"&&
                                        <td className={styles.part_container}>
                                            
                                            {item.hasPart===true && <h1><CheckCircleOutlineIcon /> 참여함</h1>}
                                            {item.hasPart===false && <h2><CancelOutlinedIcon /> 미참여</h2>}
                                            {item.hasPart!==undefined && <p>|</p>}
                                            <Button disabled={item.hasPart===true} onClick={()=>onYesClick(item.uid, item.hasPart)}>참여함</Button>
                                            <Button style={item.hasPart===true ?{color:"red"} : {}} disabled={item.hasPart===false} onClick={()=>onNoClick(item.uid, item.hasPart)}>미참여</Button>
                                        </td>
                                } */}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        </>
    )
}

export default CSVTable