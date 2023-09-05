import { Controller, Get, Param, Post, Put, Body, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentQuery } from './comment.interface';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('/post')
    async getListcommentPost(@Query() condition:CommentQuery) {        
        const comment = await this.commentService.getListCommentPost(condition);        
        return comment;
    }

    @Get('post/:postId')
    async getcommentByPostId(@Param('postId') postId:string) {
        const comment = await this.commentService.getDetailCommentByPostId(postId);
        return comment;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':commentId')
    async getcommentById(@Param('commentId') commentId:string) {
        const comment = await this.commentService.getDetailCommentById(commentId);
        return comment;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createComment(@Req() req: Request, @Body() createCommentDto: CreateCommentDto) {
        const comment = await this.commentService.createComment(createCommentDto);
        return comment;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':commentId')
    async updateComment(@Req() req: Request,@Param('commentId') commentId:string ,@Body() updateCommentDto: UpdateCommentDto) {
        const comment = await this.commentService.updateComment(commentId, updateCommentDto);
        return comment;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteComment(@Param('id') id: string) {
        const comment = await this.commentService.deleteComment(id);
        return comment;
    }
}
