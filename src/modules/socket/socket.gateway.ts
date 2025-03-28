import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/*
- Socket represent on client -> manage single connection : send / receive message between client and server
- Server (io) represent the main websocket server -> manage multiple connection : listen for connections, handle multiples sockets
*/

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  //useful for one-to-one messaging
  private userSocketMap = new Map<string, Socket>();

  //logger
  private logger = new Logger(SocketGateway.name);

  handleConnection(client: Socket) {
    const clientId = client.id;
    this.userSocketMap.set(clientId, client);
    this.logger.log(`Client connected : ${clientId}`);
  }

  handleDisconnect(socket: Socket) {
    const clientId = socket.id;
    this.userSocketMap.delete(clientId);
    this.logger.log(`Client disconnected : ${clientId}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    // client: Socket, //sender
    @MessageBody() message: string //data
  ) {
    console.log(message);
    //send the message to all connected client
    this.server.emit('message', `one client sent message: ${message}`);
  }

  @SubscribeMessage('private-message')
  handlePrivateMessage(
    // client: Socket, //sender
    @MessageBody() data: {
      receiverId: string,
      message: string
    } //data
  ) {
    const receiverSocket = this.userSocketMap.get(data.receiverId);

    if (receiverSocket) {
      //send the message to receiver with receiverId
      receiverSocket.emit('private-message', `You received message: ${data.message}`);
    }
  }

  @SubscribeMessage('join-presentation')
  handleJoinPresentation(
    @MessageBody() data: {
      clientId: string,
      presentation: string
    }
  ) {
    const clientSocket = this.userSocketMap.get(data.clientId);
    clientSocket.join(data.presentation);
        this.server.to(data.presentation).emit('join-presentation', `User ${data.clientId} joined room for presentation ${data.presentation} successfully`);
  }
}
