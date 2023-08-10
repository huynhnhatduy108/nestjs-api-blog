import { Controller, Get, Param, Post, Body, Delete, Query } from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private postervice: PostService) {}

    @Get()
    async getPost() {
        const post = await this.postervice.getListPost();
        return post;
    }

    @Get(':postId')
    async getCourse(@Param('postId') postId) {
        const post = await this.postervice.getDetailPost(postId);
        return post;
    }

    @Post()
    async addPost(@Body() CreatePostDto: CreatePostDto) {
        const post = await this.postervice.addPost(CreatePostDto);
        return post;
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        const post = await this.postervice.deletePost(id);
        return post;
    }

}
