import { HttpException,Injectable } from '@nestjs/common';
import { convertStringToObjectOrdering, generateSlugAndRandomString, stringToSlug } from 'src/helper/function';
import { PostQuery } from './post.interface';
import { PostRepository } from './post.repository';
import { ObjectId } from 'bson';
import { CreatePostDto, UpdatePostDto } from './post.dto';

const POST_PATH = ""

@Injectable()
export class PostService {
    constructor(private readonly postRepo: PostRepository){
    }    

    async getInfoByIdOrSlug (match:Object={}){
        const pipeline = [
            {
              $lookup: {
                from: "category",
                localField: "categories",
                foreignField: "_id",
                as: "categories"
              }
            },
            {
              $match: match
            },
            {
              $addFields: {
                categories: {
                  $map: {
                    input: "$categories",
                    as: "category",
                    in: {
                      _id: { $toString: "$$category._id" },
                      name: "$$category.name",
                      description: "$$category.description"
                    }
                  }
                }
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
        ]

        const posts = await this.postRepo.aggregate(pipeline)        

        let post = null
        if (posts.length > 0) {
            post = posts[0];
        }

        if (!post) throw new HttpException('Post not found', 404);

        return post
    }


    async getListPost(condition:PostQuery){
        const {page=1, pageSize=10, keyword="", tags=[], categories=[], ordering ="createdAt"} = condition;
        // {isPublic:true}
        const matchCondition: any = {$and:[]}
        const sortCondition: any = {...convertStringToObjectOrdering(ordering)}
        const skip = page * pageSize - pageSize;

        if (keyword){
            const keywordScope = {
                $or:[
                        {title:{$regex : keyword, $options: 'i'}},
                        {slug:{$regex : stringToSlug(keyword), '$options': 'i'}},
                    ]       
            }
            matchCondition.$and.push(keywordScope);
        }

        if (tags.length){
            const tagsScope = { "tags": { $in: tags } };
            matchCondition.$and.push(tagsScope);
        }

        if (categories.length){
            const catesScope = { "categories": { $in: categories } };
            matchCondition.$and.push(catesScope);
        }        

        const pipeline = [
            {
              $lookup: {
                from: "category",
                localField: "categories",
                foreignField: "_id",
                as: "categories"
              }
            },
            {
              $match: matchCondition["$and"] ? matchCondition : {}
            },
            {
              $addFields: {
                categories: {
                  $map: {
                    input: "$categories",
                    as: "category",
                    in: {
                      _id: { $toString: "$$category._id" },
                      name: "$$category.name",
                      description: "$$category.description"
                    }
                  }
                }
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
                data: [{ $skip: skip }, { $limit: pageSize }],
                count: [{ $count: "totalRecord" }]
              }
            }
          ];
          
          const result = await this.postRepo.aggregate(pipeline)

          const items = result[0].data;
          let totalRecord = 0;
          if (result[0].data.length) {
            totalRecord = result[0].count[0].totalRecord;
          }

        const data = {
            items: items,
            page: page,
            pageSize: pageSize,
            totalPage: Math.ceil(totalRecord / pageSize)
          };

        return data

    }

    async getDetailPostById(postId:string){
        const post = await this.getInfoByIdOrSlug({_id:new ObjectId(postId)});        
        return post;
    }

    async getDetailPostBySlug(slug:string){
        const post = await this.getInfoByIdOrSlug({slug});        
        return post;
    }

    async createPost(post:CreatePostDto) {
        const slug = generateSlugAndRandomString(post.title, 5)
        const newPost = await this.postRepo.create({...post, slug});        
        return newPost
    }

    async updatePost(postId, post: UpdatePostDto) {
        const slug = generateSlugAndRandomString(post.title, 5)
        const updatePost = await this.postRepo.findByConditionAndUpdate(
            { _id:new ObjectId(postId) },
            { $set: {...post, slug} },
            { returnDocument: "after" }
          ); 
        return {...updatePost["_doc"]}
    }

    async deletePost(postId){
       const deletePost =await this.postRepo.deleteOne(postId);
       if(!deletePost) throw new HttpException('Post not found', 404);
       return ;
    }
}
