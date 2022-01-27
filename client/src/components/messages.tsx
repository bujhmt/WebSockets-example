import React from 'react';
import {Message} from '../interfaces/message';

interface ComponentParams {
    messages: Message[];
}

export function Messages({messages}: ComponentParams) {
    const formatDate = (timestamp: Date): string => {
        const date = new Date(timestamp);

        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    return (
        <div>
            {messages.map((message, index) =>
                <p key={index}>[{formatDate(message?.timestamp)}] {message.author}: <strong>{message.value}</strong></p>
            )}
        </div>
    )
}
