import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer, WsResponse
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {WsEvent} from "./enums/ws-event.enum";
import {Message} from "./interfaces/message.interface";

@WebSocketGateway(80, {cors: {origin: '*'}, path: '/'})
export class AppGateway implements OnGatewayDisconnect, OnGatewayConnection {
    private readonly logger = new Logger(AppGateway.name);
    private readonly connections: Socket[] = [];
    @WebSocketServer() private readonly server: Server;

    afterInit(): void {
        this.logger.log(`${AppGateway.name} ready to accept connections...`)
    }

    handleConnection(socket: Socket): void {
        this.connections.push(socket);
        this.logger.log(`New connection: ${socket.id}`);
    }

    handleDisconnect(socket: Socket): void {
        this.connections.splice(this.connections.indexOf(socket), 1);
        this.logger.log(`Socket disconnected: ${socket.id}`);
    }

    @SubscribeMessage(WsEvent.MESSAGE)
    receiveMessage(
        @MessageBody() message: Message,
        @ConnectedSocket() client: Socket
    ) {
        this.logger.log('New message received!');
        client.broadcast.emit(WsEvent.MESSAGE, {
            ...message,
            timestamp: new Date(),
        });
    }
}
