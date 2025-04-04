import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { Presentation } from './entity/presentation.entity';

@Controller('presentation')
export class PresentationController {
    constructor(
        private presentationService: PresentationService
    ) {}

    @Post('create')
    create(@Body() presentation: Presentation): Promise<Presentation> {
        return this.presentationService.create(presentation);
    }

    @Get('find-all')
    findAll():Promise<Presentation[]> {
        return this.presentationService.findAll();
    }

    @Get('find/:id')
    findById(@Param('id') id: string): Promise<Presentation> {
        return this.presentationService.findById(id);
    }

    @Put('update/:id')
    updateById(@Param('id') id: string, @Body() presentation: Presentation): Promise<Presentation> {
        return this.presentationService.updateById(id, presentation);
    }
}
