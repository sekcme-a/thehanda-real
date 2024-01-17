import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment';
// import styles from 'src/public/styles/Calendar.module.css';
import { DockBottom, Tournament, Tune } from 'mdi-material-ui';
import koLocale from '@fullcalendar/core/locales/ko';
import styles from "./Calendar.module.css"
import { Button, ButtonBase, Checkbox, TextField, Dialog } from "@mui/material"

import { MobileDatePicker, MobileDateTimePicker } from '@mui/x-date-pickers'
// import { TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { FormControlLabel } from "@mui/material"
import Select from '@mui/material/Select';

import { firestore as db } from 'firebase/firebase';
import { useRouter } from 'next/router';


/**
 * events: calendar.data
 * setEvents: setCalendar
 * colorValues: calendar.colorValues
 * editable: boolean //편집이 가능한지 아닌지
 * hasAddScheduleButton: boolean  //스케쥴 추가 버튼 생성 or 미 생성
 * autoUrl: url주소  프로그램 추가 클릭 시 자동으로 해당 프로그램으로 이동하는 url 생성
 */
const Calendar = ({events, setEvents, editable, hasAddScheduleButton, autoUrl}) => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isOpenAddScheduleDialog, setIsOpenAddScheduleDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState({})
  const [changedSelectedEvent, setChangedSelectedEvent] = useState({})
  const [triggerReload, setTriggerReload] = useState(true)

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    // start: new Date().toDateString(),
    // end: new Date().toDateString(),
    // allDay: true,
    extendedProps: {
      memo: '',
      id: Math.floor(Math.random() * 100000) + 1,
      url: autoUrl ? autoUrl : ""
    },
    color: "red",
    allDay: false,
  })


  const router = useRouter()
  useEffect(()=>{
    console.log(events)
  },[events])

  const onValuesChange = (type, value) => {
    if(editable){
      setChangedSelectedEvent({...changedSelectedEvent, [type]: value})
    }
  }
  const onMemoChange = (value) => {
    if(editable)
    setChangedSelectedEvent({...changedSelectedEvent, extendedProps:{...changedSelectedEvent.extendedProps, memo: value}})
  }
  const onUrlChange = (value) => {
    if(editable)
     setChangedSelectedEvent({...changedSelectedEvent, extendedProps:{...changedSelectedEvent.extendedProps, url: value}})
  }


  //새로운 스케쥴 추가
  const onNewValuesChange = (type, value) => {
    if(editable){
      setNewEvent({...newEvent, [type]: value})
    }
  }
  const onNewMemoChange = (value) => {
    if(editable)
    setNewEvent({...newEvent, extendedProps:{...newEvent.extendedProps, memo: value}})
  }
  const onNewUrlChange = (value) => {
    if(editable)
     setNewEvent({...newEvent, extendedProps:{...newEvent.extendedProps, url: value}})
  }




  const calendarRef = useRef(null)

  const COLOR_PALLETE = {
    red: {bg: "rgba(255, 76, 81, 0.14)",text:"rgb(255, 76, 81)"},
    yellow:{bg: "rgba(255, 180, 0, 0.14)", text:"rgb(255, 180, 0)"},
    green: {bg: "rgba(86, 202, 0, 0.14)",text:"rgb(86, 202, 0)"},
    blue: {bg: "rgba(22, 177, 255, 0.14)",text:"rgb(22, 177, 255)"},
    purple: {bg: "rgba(145, 85, 253, 0.14)",text:"rgb(145, 85, 253)"},
  }

  useEffect(()=>{
    setIsLoading(true)
    console.log(events)
    const temp = events?.data?.map((event) => {
      let newEvent = {...event}
      console.log(event)
      if(event.start?.seconds)
        newEvent={...newEvent, start: newEvent.start.toDate()}
      if(event.end?.seconds)
        newEvent={...newEvent, end: newEvent.end.toDate()}
      if(event.color==="red")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.red.bg, borderColor: COLOR_PALLETE.red.bg, textColor: COLOR_PALLETE.red.text }
      if(event.color==="yellow")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.yellow.bg, borderColor: COLOR_PALLETE.yellow.bg, textColor: COLOR_PALLETE.yellow.text }
      if(event.color==="green")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.green.bg, borderColor: COLOR_PALLETE.green.bg, textColor: COLOR_PALLETE.green.text }
      if(event.color==="blue")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.blue.bg, borderColor: COLOR_PALLETE.blue.bg, textColor: COLOR_PALLETE.blue.text }
      if(event.color==="purple")
        newEvent={...newEvent, backgroundColor: COLOR_PALLETE.purple.bg, borderColor: COLOR_PALLETE.purple.bg, textColor: COLOR_PALLETE.purple.text }
      // if(event.allDay && newEvent.end instanceof Date)
      //   newEvent={...newEvent, end: newEvent.end.setHours(23)}
      return newEvent
    })
    console.log(temp)
    setData(temp)
    setIsLoading(false)
  },[events, triggerReload])


  // const handleEventClick = ({ event }) => {
  //   const title = prompt('Enter new title for the event', event.title);
  //   if (title) {
  //     setEvents((prevEvents) => {
  //       const index = prevEvents.findIndex((ev) =>ev.id.toString() === event.id)
  //       const updatedEvents = [...prevEvents];
  //       updatedEvents[index] = {...updatedEvents[index], title: title};
  //       return updatedEvents;
  //     });
  //     // Update event on backend or send updatedEvent to server
  //   }
  // };

  const handleEventClick = ({event}) => {
    setIsOpenDialog(true)
    const color = getColor(event.backgroundColor)
    setSelectedEvent({
      title: event._def.title,
      start: event._instance.range.start,
      end: event._instance.range.end,
      allDay: event._def.allDay,
      color: color,
      extendedProps: {
        ...event._def.extendedProps
      }
    })
    setChangedSelectedEvent({
      title: event._def.title,
      start: new Date(event._instance.range.start.getTime()-(9 * 60 * 60 * 1000)),
      end: new Date(event._instance.range.end.getTime()-(9 * 60 * 60 * 1000)),
      allDay: event._def.allDay,
      color: color,
      extendedProps: {
        ...event._def.extendedProps
      }
    })
  }

  //get color from COLOR_PALLETE
  const getColor = (rgb) => {
    if(COLOR_PALLETE.red.bg===rgb)
      return "red"
    else if(COLOR_PALLETE.yellow.bg===rgb)
      return "yellow"
    else if(COLOR_PALLETE.green.bg===rgb)
      return "green"
    else if(COLOR_PALLETE.blue.bg===rgb)
      return "blue"
    else if(COLOR_PALLETE.purple.bg===rgb)
      return "purple"
  }

  function handleEventChange(changeInfo) {
    const updatedEvent = {
      ...changeInfo.event,
      start: changeInfo.event.start,
      end: changeInfo.event.end,
    };
    setEvents((prevData) => {
      let prevEvents = prevData
      const index = prevEvents.data.findIndex((event) => event.extendedProps.id === updatedEvent._def.extendedProps.id && event.title === updatedEvent._def.title)
      prevData.data[index] = {...prevData.data[index], start: updatedEvent.start, end: updatedEvent.end}
      return prevData
    })
  }

  function onSubmitClick(){
    setEvents((prevData) => {
      let prevEvents = prevData
      const index = prevEvents.data.findIndex((event) => event.extendedProps.id === selectedEvent.extendedProps.id && event.title === selectedEvent.title)
      if(changedSelectedEvent.allDay)
        prevData.data[index] = {...prevData.data[index], ...changedSelectedEvent, end: changedSelectedEvent.end}
        // prevData.data[index] = {...prevData.data[index], ...changedSelectedEvent, end: changedSelectedEvent.end.setDate(changedSelectedEvent.end.getDate() + 1)}
      else
        prevData.data[index] = {...prevData.data[index], ...changedSelectedEvent}
      return prevData
    })
    setTriggerReload(!triggerReload)
  }
  function onDeleteClick (){
    setEvents((prevData) => {
      let prevEvents = prevData
      console.log(prevData)
      // const index = prevEvents.data.findIndex((event) => event.extendedProps.id === selectedEvent.extendedProps.id && event.title === selectedEvent.title)
      const filteredData = prevData.data.filter(obj => obj.extendedProps.id !== selectedEvent.extendedProps.id && obj.title !==selectedEvent.title);
      // if(changedSelectedEvent.allDay)
        // prevData.data[index] = undefined
      return {...prevData, data: filteredData}
    })
    setIsOpenDialog(false)
    setTriggerReload(!triggerReload)
  }


  function onNewSubmitClick(){
    setEvents((prevData) => {
      // let prevEvents = prevData
      // const index = prevEvents.data.findIndex((event) => event.extendedProps.id === selectedEvent.extendedProps.id && event.title === selectedEvent.title)
      // prevData.data[index] = {...prevData.data[index], ...changedSelectedEvent}
      console.log(newEvent)
      if(prevData.data===undefined)
        prevData = {data: [newEvent]}
      else
        prevData.data[prevData.data.length] = {...newEvent}
      console.log(prevData)
      return prevData
    })
    setIsOpenAddScheduleDialog(false)
    setTriggerReload(!triggerReload)
  }
  

  const onGoToProgramClick = () => {
    // router.push(changedSelectedEvent.extendedProps.url)
    window.open(changedSelectedEvent.extendedProps.url, "_blank", "noopener, noreferrer");
  }
  const onGoToEditProgramClick = () => {
    // router.push(changedSelectedEvent.extendedProps.url)
    window.open(changedSelectedEvent.extendedProps.editProgramUrl, "_blank", "noopener, noreferrer");
  }

  const onAddScheduleClick = () => {
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      // start: new Date().toDateString(),
      // end: new Date().toDateString(),
      // allDay: true,
      extendedProps: {
        memo: '',
        id: Math.floor(Math.random() * 100000) + 1,
        url: autoUrl ? autoUrl : ""
      },
      color: "red",
      allDay: false,
    })
    setIsOpenAddScheduleDialog(true)
  }

  if(isLoading)
    <></>

  return (
    <>
      {hasAddScheduleButton &&
        <Button variant="contained" onClick={onAddScheduleClick} size="small" sx={{mb:"10px"}}>스케쥴 추가 +</Button>
      }
      <ul className={styles.color_container}>
        
        {events.colorValues?.red &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.red}`} />
            <p className={`${styles.color_text} ${styles.red}`} >{events.colorValues.red}</p>
          </li>
        }
        {events.colorValues?.yellow &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.yellow}`} />
            <p className={`${styles.color_text} ${styles.yellow}`} >{events.colorValues.yellow}</p>
          </li>
        }
        {events.colorValues?.green &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.green}`} />
            <p className={`${styles.color_text} ${styles.green}`} >{events.colorValues.green}</p>
          </li>
        }
        {events.colorValues?.blue &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.blue}`} />
            <p className={`${styles.color_text} ${styles.blue}`} >{events.colorValues.blue}</p>
          </li>
        }
        {events.colorValues?.purple &&
          <li className={styles.item_container}>
            <div className={`${styles.dot} ${styles.purple}`} />
            <p className={`${styles.color_text} ${styles.purple}`} >{events.colorValues.purple}</p>
          </li>
        }
      </ul>

      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin,]}
        initialView =  'dayGridMonth'
        headerToolbar= {{
          start: 'prev, next, title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        }}
        views= {{
          week: {
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
          }
        }}
        events={data}
        // eventColor="rgb(154, 111, 195)"
        // events={'https://fullio/api/demo-feeds/events.json?overload-day'}
        editable={editable}
        eventClick={handleEventClick}
        // className={styles.calendar}
        dragScroll={true}
        dayMaxEvents={true}
        navLinks={true}
        ref={calendarRef}
        eventChange={handleEventChange}
        eventResizableFromStart={true}
        eventResize={function(info) {
          
          // alert(info.event.title + " end is now " + info.event.end.toISOString());
          // console.log(info)
          // if (!confirm("is this okay?")) {
            // info.revert();
          // }
        }}
        locale={koLocale}
        
      />  

      <Dialog open={isOpenDialog} onClose={()=>setIsOpenDialog(false)}>
        <div className={styles.dialog_container}>
          
          <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="제목" value={changedSelectedEvent.title} onChange={(e)=>onValuesChange("title", e.target.value)}/>
          {/* <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="이동할 주소" placeholder="https://dahanda.netlify.app/" value={changedSelectedEvent.extendedProps?.url} onChange={(e)=>onUrlChange(e.target.value)}/> */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {changedSelectedEvent.allDay ?
              <MobileDatePicker
                label="시작일"
                value={changedSelectedEvent.start}
                onChange={(e)=>onValuesChange("start", e)}
                renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
              />
            :
            <MobileDateTimePicker
              label="시작일"
              value={changedSelectedEvent.start}
              onChange={(e)=>onValuesChange("start", e)}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
            />
            }
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {changedSelectedEvent.allDay ? 
            <MobileDatePicker
            label="종료일"
            value={changedSelectedEvent.end.setHours(23)}
            onChange={(e)=>onValuesChange("end", e)}
            renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
          />
            :
            <MobileDateTimePicker
              label="종료일"
              value={changedSelectedEvent.end}
              onChange={(e)=>onValuesChange("end", e)}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
            />
            }
          </LocalizationProvider>
{/* 
          <FormControlLabel
            control={
              <Checkbox checked={changedSelectedEvent.allDay} onChange={(e)=>onValuesChange("allDay", e.target.checked)}/>
            }
            label="종일 일정" sx={{mt:"5px"}}
          /> */}

          <FormControl fullWidth sx={{mt:"13px"}}>
            <p style={{fontSize:"12px", marginBottom:"5px"}}>색상선택</p>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={changedSelectedEvent.color}
              label="색깔"
              onChange={(e)=>onValuesChange("color", e.target.value)}
              size="small"
              variant="standard"

            >
              <MenuItem value="red">빨강</MenuItem>
              <MenuItem value="yellow">노랑</MenuItem>
              <MenuItem value="green">초록</MenuItem>
              <MenuItem value="blue">파랑</MenuItem>
              <MenuItem value="purple">보라</MenuItem>
            </Select>
          </FormControl>

          <TextField variant="standard" multiline  sx={{mt:"5px"}} fullWidth size="small" label="추가 메모" value={changedSelectedEvent.extendedProps?.memo} onChange={(e)=>onMemoChange(e.target.value)}/>

          <div style={{marginTop:"20px"}} />
          {editable && 
            <div className={styles.button_container}>
              <Button onClick={onSubmitClick} variant="contained" size="small" fullWidth>일정 편집</Button>
            </div>
          }
          {editable && 
            <div className={styles.button_container}>
              <Button onClick={onDeleteClick} variant="contained" size="small" fullWidth sx={{bgcolor:"rgb(170,0,0)"}}>일정 삭제</Button>
            </div>
          }
          {changedSelectedEvent?.extendedProps?.url && 
            <div className={styles.button_container}>
              <Button onClick={onGoToProgramClick} variant="contained" size="small" fullWidth>프로그램 확인</Button>
            </div>
          }
          {changedSelectedEvent?.extendedProps?.editProgramUrl && 
            <div className={styles.button_container}>
              <Button onClick={onGoToEditProgramClick} variant="contained" size="small" fullWidth>해당 프로그램 편집으로 이동</Button>
            </div>
          }
        </div>
      </Dialog>





      <Dialog open={isOpenAddScheduleDialog} onClose={()=>setIsOpenAddScheduleDialog(false)}>
      <div className={styles.dialog_container}>
          
          <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="제목" value={newEvent.title} onChange={(e)=>onNewValuesChange("title", e.target.value)}/>
         
          {/* <TextField variant="standard" sx={{mt:"5px"}} fullWidth size="small" label="이동할 주소" placeholder="https://dahanda.netlify.app/"
            value={newEvent.extendedProps?.url} onChange={(e)=>onNewUrlChange(e.target.value)}
          /> */}
         
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
              label="시작일"
              value={newEvent.start}
              onChange={(e)=>onNewValuesChange("start", e)}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
              label="종료일"
              value={newEvent.end}
              onChange={(e)=>onNewValuesChange("end", e)}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard" style={{marginTop:"5px"}}/>}
            />
          </LocalizationProvider>

          {/* <FormControlLabel
            control={
              <Checkbox checked={newEvent.allDay} onChange={(e)=>onNewValuesChange("allDay", e.target.checked)}/>
            }
            label="종일 일정" sx={{mt:"5px"}}
          /> */}

          <FormControl fullWidth sx={{mt:"13px"}}>
            <p style={{fontSize:"12px", marginBottom:"5px"}}>색상선택</p>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newEvent.color}
              label="색깔"
              onChange={(e)=>onNewValuesChange("color", e.target.value)}
              size="small"
              variant="standard"

            >
              <MenuItem value="red">빨강</MenuItem>
              <MenuItem value="yellow">노랑</MenuItem>
              <MenuItem value="green">초록</MenuItem>
              <MenuItem value="blue">파랑</MenuItem>
              <MenuItem value="purple">보라</MenuItem>
            </Select>
          </FormControl>

          <TextField variant="standard" multiline  sx={{mt:"5px"}} fullWidth size="small" label="추가 메모" value={newEvent.extendedProps?.memo} onChange={(e)=>onNewMemoChange(e.target.value)}/>

          <div style={{marginTop:"20px"}} />
          {editable && 
            <div className={styles.button_container}>
              <Button onClick={onNewSubmitClick} variant="contained" size="small" fullWidth>일정 추가</Button>
            </div>
          }
          {changedSelectedEvent?.extendedProps?.url && 
            <div className={styles.button_container}>
              <Button onClick={onGoToProgramClick} variant="contained" size="small" fullWidth>프로그램 확인</Button>
            </div>
          }
        </div>
      </Dialog>
    </>
  );
};

export default Calendar;
