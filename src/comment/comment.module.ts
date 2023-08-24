import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './comment.model';
import { CommentRepository } from './comment.repository';

@Module({
  imports:[MongooseModule.forFeature([{name:"Comment", schema:CommentSchema}])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository]
})
export class CommentModule {}
