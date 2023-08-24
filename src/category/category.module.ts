import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategorySchema } from './category.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from 'src/post/post.repository';
import { PostSchema } from 'src/post/post.model';

@Module({
  imports:[MongooseModule.forFeature([{name:"Category", schema:CategorySchema}, {name:"Post", schema:PostSchema}])],
  providers: [CategoryService, CategoryRepository, PostRepository],
  controllers: [CategoryController]
})
export class CategoryModule {}
