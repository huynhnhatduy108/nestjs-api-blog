import { Controller, Get, Param, Post, Put, Body, Delete, Query } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentQuery } from './comment.interface';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Get()
    async getListcomment(@Query() condition:CommentQuery) {        
        const comment = await this.commentService.getListComment(condition);        
        return comment;
    }

    @Get(':commentId')
    async getcommentById(@Param('commentId') commentId:string) {
        const comment = await this.commentService.getDetailCommentById(commentId);
        return comment;
    }

    @Post()
    async createComment(@Body() createCommentDto: CreateCommentDto) {
        const comment = await this.commentService.createComment(createCommentDto);
        return comment;
    }

    @Put(':commentId')
    async updateComment(@Param('commentId') commentId:string ,@Body() updateCommentDto: UpdateCommentDto) {
        const comment = await this.commentService.updateComment(commentId, updateCommentDto);
        return comment;
    }

    @Delete(':id')
    async deleteComment(@Param('id') id: string) {
        const comment = await this.commentService.deleteComment(id);
        return comment;
    }
}
