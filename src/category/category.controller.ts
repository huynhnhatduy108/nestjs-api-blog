import { Controller, Get, Param, Post, Put, Body, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryQuery } from './category.interface';
import { CategoryService } from './category.service';
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}


    @Get('/all')
    async getListcategoryAll() {        
        const categories = await this.categoryService.getListCategoryAll();        
        return categories;
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getListcategory(@Query() condition:CategoryQuery) {        
        const categories = await this.categoryService.getListCategory(condition);        
        return categories;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':categoryId')
    async getcategoryById(@Param('categoryId') categoryId:string) {
        const category = await this.categoryService.getDetailCategoryById(categoryId);
        return category;
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('slug/:slug')
    async getcategoryBySlug(@Param('slug') slug:string) {
        const category = await this.categoryService.getDetailCategoryBySlug(slug);
        return category;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createcategory(@Body() CreatecategoryDto: CreateCategoryDto) {
        const category = await this.categoryService.createCategory(CreatecategoryDto);
        return category;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':categoryId')
    async updatecategory(@Param('categoryId') categoryId:string ,@Body() updatecategoryDto: UpdateCategoryDto) {
        const category = await this.categoryService.updateCategory(categoryId, updatecategoryDto);
        return category;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deletecategory(@Param('id') id: string) {
        const category = await this.categoryService.deleteCategory(id);
        return category;
    }
}
