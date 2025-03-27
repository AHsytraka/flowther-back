import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Presentation } from './entity/presentation.entity';
import { Model } from 'mongoose';

@Injectable()
export class PresentationService {
    constructor(
        @InjectModel(Presentation.name) private presentationModel: Model<Presentation>
    ) { }

    async create(presentation: Presentation): Promise<Presentation> {
        return await new this.presentationModel(presentation).save();
    }

    async findAll(): Promise<Presentation[]> {
        return await this.presentationModel.find();
    }

    async findById(id: string): Promise<Presentation> {
        return await this.presentationModel.findById(id);
    }
}
