import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, Socket>();
  private roomSectionNames = new Map<string, string>();
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

  @SubscribeMessage('create-section-room')
  handleCreateSectionRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sectionName: string }
  ) {
    client.join(data.sectionName);
    this.logger.log(`Section room created and client ${client.id} joined: ${data.sectionName}`);
    return { success: true, roomId: data.sectionName };
  }

  @SubscribeMessage('join-section-room')
  handleJoinSectionRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sectionName: string }
  ) {
    client.join(data.sectionName);
    this.logger.log(`Client ${client.id} joined section room: ${data.sectionName}`);
    
    // Si un nom de section est déjà défini pour cette room, l'envoyer immédiatement
    const currentSectionName = this.roomSectionNames.get(data.sectionName);
    if (currentSectionName) {
      client.emit('section-name-updated', { sectionName: currentSectionName });
    }
    
    return { success: true, joined: data.sectionName };
  }

  @SubscribeMessage('update-section-name')
  handleUpdateSectionName(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string, sectionName: string }
  ) {
    // Enregistrer le nom de section pour cette room
    this.roomSectionNames.set(data.roomId, data.sectionName);
    
    // Diffuser le changement à tous les clients de la room
    this.server.to(data.roomId).emit('section-name-updated', {
      sectionName: data.sectionName
    });
    
    this.logger.log(`Section name updated for room ${data.roomId}: ${data.sectionName}`);
    return { success: true };
  }
}