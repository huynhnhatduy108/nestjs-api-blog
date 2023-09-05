import { HttpException, Injectable } from '@nestjs/common';
import { convertStringToObjectOrdering, hashPassword } from 'src/helper/function';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserQuery } from './user.interface';
import { ObjectId } from 'bson';
import { UserRepository } from './user.repository';

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
                password:0,
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
                password:0,
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
            totalPage: Math.ceil(Number(totalRecord) / Number(pageSize)),
            totalRecord:totalRecord,
          };

        return data

    }

    async getDetailUserById(userId:string){
        const user = await this.getInfoByIdOrSlug({_id:new ObjectId(userId)});        
        return user;
    }

    async createUser(user: CreateUserDto){
        const {username, password, email} = user;

        const userExist = await this.userRepo.findOne({
            $or: [
                { username: username } ,
                { email:  email } 
            ]
        }) 
        if (userExist) throw new HttpException('Username or email was existed!', 401);

        const passswordHash = await hashPassword(password)        

        const newUser = await this.userRepo.create({...user, password:passswordHash});          

        return user;
    }


    async updateUser(userId, user: UpdateUserDto) {
      const {username, password, email, ...rest} = user;

      const userExist = await this.userRepo.findOne({_id:new ObjectId(userId)}) 
      if (!userExist) throw new HttpException('User not found', 404);

      const passswordHash = await hashPassword(password)        

      const updateUser = await this.userRepo.findByConditionAndUpdate(
          { _id:new ObjectId(userId) },
          { $set: {...rest, password:passswordHash} },
          { returnDocument: "after" }
        ); 
      return {...updateUser["_doc"]}

    }

    async deleteUser(userId){

       const userExist = await this.userRepo.findOne({_id:new ObjectId(userId)}) 
       if (!userExist) throw new HttpException('User not found', 404);

       await this.userRepo.deleteOne(userId);
    }
}
