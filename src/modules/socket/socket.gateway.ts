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
  private clientSocketMap = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const clientId = client.id;
    this.clientSocketMap.set(clientId, client);
    console.log(`Client connected : ${clientId}`);
  }

  handleDisconnect(socket: Socket) {
    const clientId = socket.id;
    this.clientSocketMap.delete(clientId);
    console.log(`Client disconnected ${clientId}`);
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
    const receiverSocket = this.clientSocketMap.get(data.receiverId);

    if(receiverSocket)
    {
      //send the message to receiver with receiverId   
      receiverSocket.emit('private-message', `You received message: ${data.message}`);
    }
  }
}
