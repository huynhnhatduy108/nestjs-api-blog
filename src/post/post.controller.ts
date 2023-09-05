import { UseGuards,Controller, Get, Param, Post, Put, Body, Delete, Query, Req } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { PostQuery } from './post.interface';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('post')
export class PostController {
    constructor(private postervice: PostService) {}

    @Get()
    async getListPost(@Query() condition:PostQuery) {        
        const post = await this.postervice.getListPost(condition);        
        return post;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/admin')
    async getListPostAdmin(@Query() condition:PostQuery) {        
        const post = await this.postervice.getListPostAdmin(condition);        
        return post;
    }

   @UseGuards(AuthGuard('jwt'))
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

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createPost(@Req() req: Request,@Body() CreatePostDto: CreatePostDto) {
        const post = await this.postervice.createPost(CreatePostDto);
        return post;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':postId')
    async updatePost(@Req() req: Request,@Param('postId') postId:string ,@Body() updatePostDto: UpdatePostDto) {
        const post = await this.postervice.updatePost(postId, updatePostDto);
        return post;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        const post = await this.postervice.deletePost(id);
        return post;
    }

}
