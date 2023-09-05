import { HttpException,Injectable } from '@nestjs/common';
import { compareOldToNewList, convertStringToObjectOrdering, generateSlugAndRandomString, stringToSlug } from 'src/helper/function';
import { PostQuery } from './post.interface';
import { PostRepository } from './post.repository';
import { ObjectId } from 'bson';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { CategoryRepository } from 'src/category/category.repository';

const POST_PATH = ""

@Injectable()
export class PostService {
    constructor(private readonly postRepo: PostRepository,private readonly categoryRepo: CategoryRepository ){
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
              $lookup: {
                  from: "user",
                  localField: "author",
                  foreignField: "_id",
                  as: "authorDocs"
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
                },
                author:{
                  username: { $arrayElemAt: ["$authorDocs.username", 0] },
                  fullName: { $arrayElemAt: ["$authorDocs.fullName", 0] },
              }
              }
            },
            {
              $project: {
                authorDocs:0,
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
        const matchCondition: any = {$and:[{isPublic:true}]}
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
              $match: matchCondition["$and"].length ? matchCondition : {}
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
                data: [{ $skip: skip }, { $limit: Number(pageSize) }],
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
            page: Number(page),
            pageSize: Number(pageSize),
            totalPage: Math.ceil(Number(totalRecord) / Number(pageSize)),
            totalRecord:totalRecord,
          };

        return data

    }

    async getListPostAdmin(condition:PostQuery){
      const {page=1, pageSize=10, keyword="", tags=[], categories=[], ordering ="createdAt"} = condition;
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
            $match: matchCondition["$and"].length ? matchCondition : {}
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
              data: [{ $skip: skip }, { $limit: Number(pageSize) }],
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
          page: Number(page),
          pageSize: Number(pageSize),
          totalPage: Math.ceil(Number(totalRecord) / Number(pageSize)),
          totalRecord:totalRecord,
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

    async createPost(user,post:CreatePostDto) {
        const slug = generateSlugAndRandomString(post.title, 5)        
        const newPost = await this.postRepo.create({...post, slug, author:user._id});          
        if (post.categories.length){
          await this.categoryRepo.updateMany({_id: {"$in": post.categories}},{$push: {posts: newPost._id}})
        }  
        
        return newPost
    }

    async updatePost(postId:string, post: UpdatePostDto) {

        const postExist = await this.postRepo.findOne({_id:new ObjectId(postId)}) 

        if (!postExist) throw new HttpException('Post not found', 404);
        
        const slug = generateSlugAndRandomString(post.title, 5)

        if ("categories" in post) {
          const categoryIds = post.categories;
          const categoryExistIds = postExist.categories;
          const { isEqual, listAdd, listDelete} = compareOldToNewList(categoryIds, categoryExistIds);          
          
          if (!isEqual) {
            if (listAdd.length > 0) {
              await this.categoryRepo.updateMany(
                { _id: { $in: listAdd.map((cate:string) => new ObjectId(cate)) } },
                { $push: { posts:postExist._id } }
              );
            }
            if (listDelete.length > 0) {
              await this.categoryRepo.updateMany(
                { _id: { $in: listDelete.map((cate:string) => new ObjectId(cate)) } },
                { $pull: { posts:postExist._id } }
              );
            }
          }
        }

        const updatePost = await this.postRepo.findByConditionAndUpdate(
            { _id:new ObjectId(postId) },
            { $set: {...post, slug} },
            { returnDocument: "after" }
          ); 

        return {...updatePost["_doc"]}
    }

    async deletePost(postId){

      const postExist = await this.postRepo.findOne({_id:new ObjectId(postId)}) 
      if (!postExist) throw new HttpException('Post not found', 404);

      if (postExist.categories.length){
        await this.categoryRepo.updateMany(
          { _id: { $in: postExist.categories } },
          { $pull: { posts:postExist._id } }
          );
      }

      await this.postRepo.deleteOne(postId);

      return ;
    }
}
