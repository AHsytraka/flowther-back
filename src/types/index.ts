import { ApiProperty } from "@nestjs/swagger";

export class PresentationContent {
    @ApiProperty()
    section: string;

    @ApiProperty()
    order: number;

    @ApiProperty()
    content: string;
}