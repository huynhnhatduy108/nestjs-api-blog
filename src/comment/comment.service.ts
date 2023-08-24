import { HttpException, Injectable } from '@nestjs/common';
import { convertStringToObjectOrdering } from 'src/helper/function';
import { CommentRepository } from './comment.repository';
import { ObjectId } from 'bson';
import { CommentQuery } from './comment.interface';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';

@Injectable()
export class CommentService {
    constructor(private readonly commentRepo: CommentRepository){
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

        const comments = await this.commentRepo.aggregate(pipeline)        

        let comment = null
        if (comments.length > 0) {
            comment = comments[0];
        }

        if (!comment) throw new HttpException('comment not found', 404);

        return comment
    }


    async getListComment(condition:CommentQuery){
        const {page=1, pageSize=10, keyword="", ordering ="createdAt"} = condition;
        // {isPublic:true}
        const matchCondition: any = {$and:[]}
        const sortCondition: any = {...convertStringToObjectOrdering(ordering)}
        const skip = Number(page) * Number(pageSize) - Number(pageSize);

        if (keyword){
            const keywordScope = {
                $or:[
                        {title:{$regex : keyword, $options: 'i'}},
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
          
          const result = await this.commentRepo.aggregate(pipeline)

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

    async getDetailCommentById(commentId:string){
        const comment = await this.getInfoByIdOrSlug({_id:new ObjectId(commentId)});        
        return comment;
    }

    async createComment(comment:CreateCommentDto) {
        const newcomment = await this.commentRepo.create({...comment});        
        return newcomment
    }

    async updateComment(commentId, comment: UpdateCommentDto) {
        const updatecomment = await this.commentRepo.findByConditionAndUpdate(
            { _id:new ObjectId(commentId) },
            { $set: {...comment} },
            { returnDocument: "after" }
          ); 
        return {...updatecomment["_doc"]}
    }

    async deleteComment(commentId){

       const commentExist = await this.commentRepo.findOne({_id:new ObjectId(commentId)}) 
       if (!commentExist) throw new HttpException('Comment not found', 404);

       await this.commentRepo.deleteOne(commentId);
    }

}
