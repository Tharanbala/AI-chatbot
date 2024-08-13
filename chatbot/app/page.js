"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from "react";
import { Box, Button, Stack, TextField } from "@mui/material"

export default function Home() {

  const [details, setDetails] = useState(false)
  const [messages, setMessages] = useState([
    {role: "assistant", content: ""}
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function getEmbedding(text) {
    const response = await fetch('http://127.0.0.1:5000/api/embed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return data.embedding;
  } 

  const sendMessage = async () => {
    if (!msg.trim() || isLoading) return;
    setIsLoading(true)

    setMsg('')
    setMessages((messages) => [
      ...messages, 
      {role: 'user', content: msg},
      { role: 'assistant', content: '' }
    ])
    
    const response = await fetch('api/chat', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, {role: 'user', content: msg}],
        embedding: await getEmbedding(msg),
      }),
    }).then(async (res) => {
      const reader = res.body.getReader()  // Get a reader to read the response body
      const decoder = new TextDecoder()  // Create a decoder to decode the response text
  
      let result = ''
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ]
        })
        return reader.read().then(processText)  // Continue reading the next chunk of the response
      })
    })
    

    setIsLoading(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const setDeets = (e) => {
    e.preventDefault()
    setDetails(true)
    setMessages([{role: "assistant", content: "Hello Tharan! Welcome to Pounce Chat. How can I assist you today?"}])
  }

  return (
    <main className="min-h-screen">
      <nav className="bg-[url('/wave.jpg')] border-b-4 border-b-black">
        <div className="flex flex-wrap items-center justify-between mx-auto p-6">
            <span className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white">Technology Resources</span>
            {/* <Image src={'/branding.svg'} alt='UWM logo' width="250" height="250"/> */}
        </div>
      </nav>
      <div className="flex flex-col m-6 items-center">
        <span className="text-4xl mt-6 font-semibold whitespace-nowrap">Find your Account</span>
        <span className="whitespace-nowrap mt-2">Enter the details in the form to find your account and get connected to Pounce Chat!</span>
      </div>
      <div className="flex flex-l">
          <div className="w-3/6">
            <div className="flex flex-col items-center">
              <form className="grid grid-cols-6 items-center text-black">
                <input className="col-span-3 p-3 border" type='text' placeholder="First Name"/> 
                <input className="col-span-2 p-3 border mx-3" type="text" placeholder="Last Name"/>
                <button onClick={setDeets} className="text-black bg-yellow-500 p-3 hover:bg-yellow-700" type="submit">Search</button>
              </form>
            </div>
            {details ? <div className="mt-10 flex flex-col items-center">
              <span className="text-2xl whitespace-nowrap">Account Details</span>
              <span className="whitespace-nowrap font-semibold mt-4 py-2">Name: Tharan Bala</span>
              <span className="whitespace-nowrap font-semibold py-2">ePanther ID: 991433592</span>
              <span className="whitespace-nowrap font-semibold py-2">Last Password Set: Aug 12,2024</span>
              <span className="whitespace-nowrap font-semibold py-2">Password Expired: Aug 12,2025</span>
            </div> : <></>}
          </div>
          <div className="w-3/6">
            <Box
              width="auto"
              height="70vh"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              >
                <Stack direction={'column'} 
                width="500px"
                height="700px"
                border="1px solid black"
                p={2}
                spacing={3}
                >
                  <Stack direction={'column'} 
                  spacing={2}
                  flexGrow={1}
                  overflow="auto"
                  maxHeight="100%"
                  >
                    {messages.map((message, index) => (
                      <Box
                        key={index}
                        display="flex"
                        justifyContent={
                          message.role === 'assistant' ? 'flex-start' : 'flex-end'
                        }
                      >
                      <Box
                        bgcolor={
                          message.role === 'assistant'
                            ? 'primary.main'
                            : 'secondary.main'
                        }
                        color="white"
                        borderRadius={16}
                        p={3}
                      >
                        {message.content}
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Stack>
                <Stack direction={'row'} spacing={2}>
                  <TextField label="Message" fullWidth value={msg} onChange={(e) => setMsg(e.target.value)} onKeyPress={handleKeyPress} disabled={isLoading}/>
                  <Button variant="contained" onClick={sendMessage} disabled={isLoading}>{isLoading ? 'Sending' : 'Send'}</Button>
                </Stack>
              </Stack>
            </Box>
          </div>
      </div>
    </main>   
  );
}
