import { Controller, Get, Param, Post, Put, Body, Delete, Query } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { PostQuery } from './post.interface';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private postervice: PostService) {}

    @Get()
    async getListPost(@Query() condition:PostQuery) {        
        const post = await this.postervice.getListPost(condition);        
        return post;
    }

    @Get(':postId')
    async getPostById(@Param('postId') postId:string) {
        const post = await this.postervice.getDetailPostById(postId);
        return post;
    }


    @Get('slug/:slug')
    async getPostBySlug(@Param('slug') slug:string) {
        const post = await this.postervice.getDetailPostBySlug(slug);
        return post;
    }

    @Post()
    async createPost(@Body() CreatePostDto: CreatePostDto) {
        const post = await this.postervice.createPost(CreatePostDto);
        return post;
    }

    @Put(':postId')
    async updatePost(@Param('postId') postId:string ,@Body() updatePostDto: UpdatePostDto) {
        const post = await this.postervice.updatePost(postId, updatePostDto);
        return post;
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        const post = await this.postervice.deletePost(id);
        return post;
    }

}
