import React, {FormEvent, useEffect, useState} from 'react';
import {WsEvent} from './enums/ws-event';
import {Message} from './interfaces/message';
import {io, Socket} from 'socket.io-client';
import {Messages} from "./components/messages";

function App() {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<Message[]>([]);

    const [newMessage, setNewMessage] = useState('');
    const [author, setAuthor] = useState('');

    useEffect(() => {
        const socket = io('ws://localhost:80');
        setSocket(socket);

        socket.on('connect', () => {
            console.log('Connected to server!');
        });

        socket.on('connect_error', (err: unknown) => {
            console.error(err);
        });

        socket.on('disconnect', (reason: unknown) => {
            console.error(reason);
        });
    }, []);

    socket?.on(WsEvent.MESSAGE, (message: Message) => {
        setMessages([...messages, message]);
    });

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newMessage.trim().length > 1) {
            socket?.emit(WsEvent.MESSAGE, {
                value: newMessage,
                author: author || 'Anon',
            });

            setMessages([
                ...messages,
                {
                    value: newMessage,
                    author: 'You',
                    timestamp: new Date(),
                }
            ]);

            setNewMessage('');
        }
    }

    const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        setNewMessage(event.target.value);
    }

    const handleAuthorInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        setAuthor(event.target.value);
    }

    return (
        <div className="chat">
            <Messages messages={messages}/>
            <form className="input-message" onSubmit={sendMessage}>
                <input value={author} placeholder="From" type="text" onInput={handleAuthorInput}/>
                <input value={newMessage} placeholder="Message" type="text" onInput={handleMessageInput}/>
                <input type="submit"/>
            </form>
        </div>
    );
}

export default App;
