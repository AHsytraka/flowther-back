import { Module } from '@nestjs/common';
import { SocketModule } from './modules/socket/socket.module';
import { PresentationModule } from './modules/presentation/presentation.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/flowther'),
    SocketModule,
    PresentationModule
  ]
})
export class AppModule {}
