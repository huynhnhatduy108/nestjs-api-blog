import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { Comment } from './comment.model';


@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(
    @InjectModel('Comment')
    private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }

}