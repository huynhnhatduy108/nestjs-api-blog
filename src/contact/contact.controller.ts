import { Controller, Get, Param, Post, Put, Body, Delete, Query } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto } from './contact.dto';
import { ContactQuery } from './contact.interface';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) {}


    @Get()
    async getListContact(@Query() condition:ContactQuery) {        
        const contact = await this.contactService.getListContact(condition);        
        return contact;
    }

    @Get(':contactId')
    async getContactById(@Param('contactId') contactId:string) {
        const contact = await this.contactService.getDetailContactById(contactId);
        return contact;
    }

    @Post()
    async createContact(@Body() CreatecontactDto: CreateContactDto) {
        const contact = await this.contactService.createContact(CreatecontactDto);
        return contact;
    }

    @Put(':contactId')
    async updateContact(@Param('contactId') contactId:string ,@Body() updatecontactDto: UpdateContactDto) {
        const contact = await this.contactService.updateContact(contactId, updatecontactDto);
        return contact;
    }

    @Delete(':id')
    async deleteContact(@Param('id') id: string) {
        const contact = await this.contactService.deleteContact(id);
        return contact;
    }

}
