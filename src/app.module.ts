import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  }),PostModule, CategoryModule, ContactModule, UserModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
  exports:[],
})
export class AppModule {}
