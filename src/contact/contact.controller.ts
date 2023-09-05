import { Controller, Get, Param, Post, Put, Body, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateContactDto, UpdateContactDto } from './contact.dto';
import { ContactQuery } from './contact.interface';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getListContact(@Query() condition:ContactQuery) {        
        const contact = await this.contactService.getListContact(condition);        
        return contact;
    }

    @UseGuards(AuthGuard('jwt'))
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

    @UseGuards(AuthGuard('jwt'))
    @Put(':contactId')
    async updateContact(@Param('contactId') contactId:string ,@Body() updatecontactDto: UpdateContactDto) {
        const contact = await this.contactService.updateContact(contactId, updatecontactDto);
        return contact;
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteContact(@Param('id') id: string) {
        const contact = await this.contactService.deleteContact(id);
        return contact;
    }

}
