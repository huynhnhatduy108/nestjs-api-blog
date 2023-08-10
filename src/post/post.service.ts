import { HttpException,Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
    post = [
        {
            id: 1,
            title: 'Chúng tôi là ai?',
            description: 'Sun Asterisk chứa đựng ước mơ và mục tiêu kiến tạo nên thật nhiều những điều tốt đẹp cho xã hội của tập thể những chiến binh mặt trời.',
            author: 'Sun*',
            url: 'https://sun-asterisk.vn/ve-chung-toi/',
          },
          {
            id: 2,
            title: 'Chúng tôi làm gì?',
            description: 'Là một Digital Creative Studio, Sun* luôn đề cao tinh thần làm chủ sản phẩm, tư duy sáng tạo trong mỗi dự án để mang đến những trải nghiệm "Awesome" nhất cho end-user',
            author: 'Sun*',
            url: 'https://sun-asterisk.vn/creative-engineering/',
          },
    ];

   
    getListPost(): Promise<any> {
        return new Promise(resolve => {
             resolve(this.post);
        });
    }

    getDetailPost(postId): Promise<any> {
        let id = Number(postId);
        return new Promise(resolve => {
            const post = this.post.find(post => post.id === id);
            if (!post) {
                 throw new HttpException('Post not found', 404)
            }
            resolve(post);
        });
    }

    addPost(post): Promise<any> {
        return new Promise(resolve => {
            this.post.push(post);
            resolve(this.post);
        });
    }

    deletePost(postId): Promise<any> {
        let id = Number(postId);
        return new Promise(resolve => {
            let index = this.post.findIndex(post => post.id === id);
            if (index === -1) {
                throw new HttpException('Post not found', 404);
            }
            this.post.splice(index, 1);
            resolve(this.post);
        });
    }
}
