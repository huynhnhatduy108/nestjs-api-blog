import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PostModule, CategoryModule, ContactModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
