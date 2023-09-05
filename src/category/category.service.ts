import { HttpException, Injectable } from '@nestjs/common';
import { convertStringToObjectOrdering, generateSlugAndRandomString, stringToSlug } from 'src/helper/function';
import { CategoryRepository } from './category.repository';
import { ObjectId } from 'bson';
import { CategoryQuery } from './category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.model';
import { PostRepository } from 'src/post/post.repository';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepo: CategoryRepository,private readonly postRepo: PostRepository, ){
    }    

    async getInfoByIdOrSlug (match:Object={}){
        const pipeline = [
            {
              $match: match
            },
            {
              $addFields: {
                postSize:{ $size: '$posts' },
              }
            },
            {
              $project: {
                posts:0,
                deletedFlag: 0,
                createdAt:0,
                updatedAt:0,
                __v:0,
              }
            },
        ]

        const categories = await this.categoryRepo.aggregate(pipeline)        

        let category = null
        if (categories.length > 0) {
            category = categories[0];
        }

        if (!category) throw new HttpException('category not found', 404);

        return category
    }

    async getListCategoryAll(){

      const pipeline = [
          {
            $addFields: {
              postSize:{ $size: '$posts' },
            }
          },
          {
            $project: {
              posts:0,
              deletedFlag: 0,
              createdAt:0,
              updatedAt:0,
              __v:0,
            }
          },
        ];
        
      const result = await this.categoryRepo.aggregate(pipeline)
      return result

  }


    async getListCategory(condition:CategoryQuery){
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
                postSize:{ $size: '$posts' },
              }
            },
            {
              $project: {
                posts:0,
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
          
          const result = await this.categoryRepo.aggregate(pipeline)

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

    async getDetailCategoryById(categoryId:string){
        const category = await this.getInfoByIdOrSlug({_id:new ObjectId(categoryId)});        
        return category;
    }

    async getDetailCategoryBySlug(slug:string){
        const category = await this.getInfoByIdOrSlug({slug});        
        return category;
    }

    async createCategory(category:CreateCategoryDto) {
        const slug = generateSlugAndRandomString(category.name, 5)
        const newcategory = await this.categoryRepo.create({...category, slug});        
        return newcategory
    }

    async updateCategory(categoryId, category: UpdateCategoryDto) {
        const slug = generateSlugAndRandomString(category.name, 5)
        const updatecategory = await this.categoryRepo.findByConditionAndUpdate(
            { _id:new ObjectId(categoryId) },
            { $set: {...category, slug} },
            { returnDocument: "after" }
          ); 
        return {...updatecategory["_doc"]}
    }

    async deleteCategory(categoryId){

       const categoryExist = await this.categoryRepo.findOne({_id:new ObjectId(categoryId)})
       if (!categoryExist) throw new HttpException('Category not found', 404);       
 
       if (categoryExist["posts"].length){
         await this.postRepo.updateMany(
           { _id: { $in: categoryExist["posts"] } },
           { $pull: { categorys:categoryExist._id } }
           );
       }
 
       await this.categoryRepo.deleteOne(categoryId);
       return ;
    }
}
