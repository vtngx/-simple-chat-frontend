import './Chat.css'
import io from 'socket.io-client'
import Input from '../Input/Input'
import queryString from 'query-string'
import InfoBar from '../InfoBar/InfoBar'
import Messages from '../Messages/Messages'
import React, { useState, useEffect } from 'react'

let socket

const Chat = ({location}) => {
  const [ name, setName ] = useState('')
  const [ room, setRoom ] = useState('')
  const [ message, setMessage ] = useState('')
  const [ messages, setMessages ] = useState([])
  const ENDPOINT = process.env.ENDPOINT || "https://simple-chat-prod.herokuapp.com"

  useEffect(() => {
    //  get params from query
    const { room, name } = queryString.parse(location.search)

    //  connect to socketio
    socket = io(ENDPOINT, { transports: ['websocket']})

    //  set params
    setName(name)
    setRoom(room)

    //  join chat
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error)
      }
    })

    //  disconnect when leave chat
    return () => {
      socket.emit('disconnect')
      socket.off()
    }
  }, [ENDPOINT, location.search])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message])
    })
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault()
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        {/* <input
          type='text'
          value={message}
          onChange={event => setMessage(event.target.value)}
          onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        /> */}
      </div>
    </div>
  )
}

export default Chat
