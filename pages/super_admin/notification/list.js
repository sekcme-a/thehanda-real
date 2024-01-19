
import List from "src/super_admin/notification/List"
import ListControl from "src/super_admin/notification/ListControl"

const NotificationList = () => {

  return(
    <div style={{padding: "30px"}}>
      <h1 style={{fontWeight:"bold", marginBottom:"15px"}}>공지 리스트</h1>
      <List />
      <ListControl />
    
    </div>
  )
}
export default NotificationList