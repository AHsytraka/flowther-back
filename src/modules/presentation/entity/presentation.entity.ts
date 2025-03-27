import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { PresentationContent } from "src/types";

@Schema()
export class Presentation extends Document {
    @Prop()
    author: string;

    @Prop()
    title: string;

    @Prop()
    content: PresentationContent[];
}

export const PresentationSchema = SchemaFactory.createForClass(Presentation);