import { Controller, Get, Param, Post, Put, Body, Delete, Query } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryQuery } from './category.interface';
import { CategoryService } from './category.service';
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}


    @Get()
    async getListcategory(@Query() condition:CategoryQuery) {        
        const category = await this.categoryService.getListCategory(condition);        
        return category;
    }

    @Get(':categoryId')
    async getcategoryById(@Param('categoryId') categoryId:string) {
        const category = await this.categoryService.getDetailCategoryById(categoryId);
        return category;
    }


    @Get('slug/:slug')
    async getcategoryBySlug(@Param('slug') slug:string) {
        const category = await this.categoryService.getDetailCategoryBySlug(slug);
        return category;
    }

    @Post()
    async createcategory(@Body() CreatecategoryDto: CreateCategoryDto) {
        const category = await this.categoryService.createCategory(CreatecategoryDto);
        return category;
    }

    @Put(':categoryId')
    async updatecategory(@Param('categoryId') categoryId:string ,@Body() updatecategoryDto: UpdateCategoryDto) {
        const category = await this.categoryService.updateCategory(categoryId, updatecategoryDto);
        return category;
    }

    @Delete(':id')
    async deletecategory(@Param('id') id: string) {
        const category = await this.categoryService.deleteCategory(id);
        return category;
    }
}
