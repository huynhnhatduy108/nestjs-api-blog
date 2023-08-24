import { HttpException, Injectable } from '@nestjs/common';
import { convertStringToObjectOrdering } from 'src/helper/function';
import { UpdateUserDto } from './auth.dto';
import { UserQuery } from './auth.interface';
import { ObjectId } from 'bson';
import { UserRepository } from './auth.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository){
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

        const users = await this.userRepo.aggregate(pipeline)        

        let user = null
        if (users.length > 0) {
            user = users[0];
        }

        if (!user) throw new HttpException('user not found', 404);

        return user
    }


    async getListUser(condition:UserQuery){
        const {page=1, pageSize=10, keyword="", ordering ="createdAt"} = condition;
        // {isPublic:true}
        const matchCondition: any = {$and:[]}
        const sortCondition: any = {...convertStringToObjectOrdering(ordering)}
        const skip = Number(page) * Number(pageSize) - Number(pageSize);

        if (keyword){
            const keywordScope = {
                $or:[
                        {usename:{$regex : keyword, $options: 'i'}},
                        {fullName:{$regex : keyword, $options: 'i'}},
                        {email:{$regex : keyword, $options: 'i'}},

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
          
          const result = await this.userRepo.aggregate(pipeline)

          const items = result[0].data;
          let totalRecord = 0;
          if (result[0].data.length) {
            totalRecord = result[0].count[0].totalRecord;
          }

        const data = {
            items: items,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPage: Math.ceil(Number(totalRecord) / Number(pageSize))
          };

        return data

    }

    async getDetailUserById(userId:string){
        const user = await this.getInfoByIdOrSlug({_id:new ObjectId(userId)});        
        return user;
    }

    async updateUser(userId, user: UpdateUserDto) {
        const updateUser = await this.userRepo.findByConditionAndUpdate(
            { _id:new ObjectId(userId) },
            { $set: {...user} },
            { returnDocument: "after" }
          ); 
        return {...updateUser["_doc"]}
    }

    async deleteUser(userId){

       const userExist = await this.userRepo.findOne({_id:new ObjectId(userId)}) 
       if (!userExist) throw new HttpException('user not found', 404);

       await this.userRepo.deleteOne(userId);
    }
}
