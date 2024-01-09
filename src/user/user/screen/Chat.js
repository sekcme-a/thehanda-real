
import ChatView from "src/chat/ChatView"

const Chat = ({data}) => {


  return(
    <div>

      <ChatView uid={data.uid} userName={data.basicProfile.displayName} />

    </div>
  )
}

export default Chat