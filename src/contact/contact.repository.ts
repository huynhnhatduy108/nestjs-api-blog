
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { Contact } from './contact.model';


@Injectable()
export class ContactRepository extends BaseRepository<Contact> {
  constructor(
    @InjectModel('Contact')
    private readonly contactModel: Model<Contact>,
  ) {
    super(contactModel);
  }

}