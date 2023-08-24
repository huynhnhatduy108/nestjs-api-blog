import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactSchema } from './contact.model';
import { ContactRepository } from './contact.repository';
import { ContactService } from './contact.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{name:"Contact", schema:ContactSchema}])],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository]
})
export class ContactModule {}
