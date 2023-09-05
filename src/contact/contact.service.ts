import { HttpException, Injectable } from '@nestjs/common';
import { convertStringToObjectOrdering, generateSlugAndRandomString, stringToSlug } from 'src/helper/function';
import { ContactQuery } from './contact.interface';
import { ObjectId } from 'bson';
import { CreateContactDto, UpdateContactDto } from './contact.dto';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactService {
    constructor(private readonly contactRepo: ContactRepository){
    }    

    async getInfoByIdOrSlug (match:Object={}){
        const pipeline = [
            {
              $match: match
            },
            {
              $project: {
                deletedFlag: 0,
                createdAt:0,
                updatedAt:0,
                __v:0,
              }
            },
        ]

        const contacts = await this.contactRepo.aggregate(pipeline)        

        let contact = null
        if (contacts.length > 0) {
            contact = contacts[0];
        }

        if (!contact) throw new HttpException('contact not found', 404);

        return contact
    }


    async getListContact(condition:ContactQuery){
        const {page=1, pageSize=10, keyword="", ordering ="createdAt"} = condition;
        // {isPublic:true}
        const matchCondition: any = {$and:[]}
        const sortCondition: any = {...convertStringToObjectOrdering(ordering)}
        const skip = Number(page) * Number(pageSize) - Number(pageSize);

        if (keyword){
            const keywordScope = {
                $or:[
                        {title:{$regex : keyword, $options: 'i'}},
                        {slug:{$regex : stringToSlug(keyword), '$options': 'i'}},
                    ]       
            }
            matchCondition.$and.push(keywordScope);
        } 

        const pipeline = [
            {
              $match: matchCondition["$and"].length ? matchCondition : {}
            },
            {
              $addFields: {
              }
            },
            {
              $project: {
                deletedFlag: 0,
                createdAt:0,
                updatedAt:0,
                __v:0,
              }
            },
            {
              $sort: sortCondition
            },
            {
              $facet: {
                data: [{ $skip: skip }, { $limit: Number(pageSize) }],
                count: [{ $count: "totalRecord" }]
              }
            }
          ];
          
          const result = await this.contactRepo.aggregate(pipeline)

          const items = result[0].data;
          let totalRecord = 0;
          if (result[0].data.length) {
            totalRecord = result[0].count[0].totalRecord;
          }

        const data = {
            items: items,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPage: Math.ceil(Number(totalRecord) / Number(pageSize)),
            totalRecord:totalRecord,
          };

        return data

    }

    async getDetailContactById(contactId:string){
        const contact = await this.getInfoByIdOrSlug({_id:new ObjectId(contactId)});        
        return contact;
    }

    async createContact(contact:CreateContactDto) {
        const newContact = await this.contactRepo.create({...contact});        
        return newContact
    }

    async updateContact(contactId, contact: UpdateContactDto) {
        const updateContact = await this.contactRepo.findByConditionAndUpdate(
            { _id:new ObjectId(contactId) },
            { $set: {...contact} },
            { returnDocument: "after" }
          ); 
        return {...updateContact["_doc"]}
    }

    async deleteContact(contactId){

       const contactExist = await this.contactRepo.findOne({_id:new ObjectId(contactId)}) 
       if (!contactExist) throw new HttpException('Contact not found', 404);

       await this.contactRepo.deleteOne(contactId);
    }
}
