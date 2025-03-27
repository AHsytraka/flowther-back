import { Module } from '@nestjs/common';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Presentation, PresentationSchema } from './entity/presentation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Presentation.name, schema: PresentationSchema}])
  ],
  controllers: [PresentationController],
  providers: [PresentationService]
})
export class PresentationModule {}
