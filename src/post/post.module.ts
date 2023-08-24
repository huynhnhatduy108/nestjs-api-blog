import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post.model';
import { CategoryRepository } from 'src/category/category.repository';
import { CategorySchema } from 'src/category/category.model';

@Module({
  imports:[MongooseModule.forFeature([{name:"Post", schema:PostSchema}, {name:"Category", schema:CategorySchema}])],
  controllers: [PostController],
  providers: [PostService, PostRepository, CategoryRepository]
})
export class PostModule {}
