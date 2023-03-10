import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { Award, Purchase, Shop, User } from '@prisma/client';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { CreateShopDto } from '../src/shop/dto/create-shop.dto';
import { CreateAwardDto } from '../src/award/dto/create-award.dto';

describe('App', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Init for start test
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);

    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "shops" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "award_user" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "awards" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "purchases" RESTART IDENTITY CASCADE;`,
    );
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "friends" RESTART IDENTITY CASCADE;`,
    );

    pactum.request.setBaseUrl('http://localhost:3000');
  });

  // closing app
  afterAll(() => {
    app.close();
  });

  // Test

  // Auth
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'first@test.com',
      password: 'Difficile12',
    };
    const createUserDto: CreateUserDto = {
      name: 'firsttest',
      email: 'first@test.com',
      password: 'Difficile12',
      passwordConfirm: 'Difficile12',
    };
    describe('Signup', () => {
      it('throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('throw if password not match', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            name: createUserDto.name,
            email: createUserDto.email,
            password: 'Difficile12',
            passwordConfirm: 'Difficile12$',
          })
          .expectJson({
            statusCode: 400,
            message: ['Confirm must match password exactly'],
            error: 'Bad Request',
          })
          .expectStatus(400);
      });
      it('throw if no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(createUserDto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
      it('throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('throw if no body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
    });
  });

  // User
  describe('User', () => {
    it('edit current user', async () => {
      const dto: UpdateUserDto = {
        email: 'second@test.com',
      };
      await prisma.user.findUnique({
        where: {
          email: 'first@test.com',
        },
      });
      return pactum
        .spec()
        .patch('/users/1')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withJson(dto)
        .expectStatus(200);
    });
    it('Create second user', async () => {
      const createUserDto: CreateUserDto = {
          name: 'SecondUser',
          email: 'second@gmmail.com',
          password: 'StrongPSw12',
          passwordConfirm: 'StrongPSw12',
      }
       return pactum
        .spec()
        .post('/users')
        .withJson(createUserDto)
        .expectStatus(201);
    })
  });

  // Shop
  describe('Shop', () => {
    it('Create', () => {
      const createUserDto: CreateUserDto = {
        name: 'ShopUnoo',
        email: 'first@shop.com',
        password: 'passwordQQ123%%',
        passwordConfirm: 'passwordQQ123%%',
      };
      const createShopDto: CreateShopDto = {
        address: 'First Shop address',
        description: 'First shop desd',
      };
      return pactum
        .spec()
        .post('/shops')
        .withJson({ ...createUserDto, ...createShopDto })
        .expectStatus(201);
    });
    it('List first page', () => {
      return pactum.spec().get('/shops').expectStatus(200);
    });
    it('List second page', () => {
      return pactum.spec().get('/shops?cursor=2').expectStatus(200);
    });
  });

  // Award
  describe('Award', () => {
    describe('Create many', () => {
      it('Create award 1', () => {
        const createAwardDto: CreateAwardDto = {
          title: 'Award 1',
          quantity: 100,
        };
        return pactum
          .spec()
          .post('/awards')
          .withJson(createAwardDto)
          .expectStatus(201);
      });
      it('Create award 2', () => {
        const createAwardDto: CreateAwardDto = {
          title: 'Award 2',
          description: 'Award 2 desc',
          quantity: 100,
        };
        return pactum
          .spec()
          .post('/awards')
          .withJson(createAwardDto)
          .expectStatus(201);
      });
    });
  });

  // Purchase
  describe('Purchase', () => {
    it('Create first', () => {
      return pactum
        .spec()
        .post('/purchases')
        .withJson({
          userId: 1,
          shopId: 3,
          points: 10,
        })
        .expectStatus(201);
    });
    it('Create second', () => {
      return pactum
        .spec()
        .post('/purchases')
        .withJson({
          userId: 1,
          shopId: 3,
          points: 30,
        })
        .expectStatus(201);
    });
    it('Create third', () => {
      return pactum
        .spec()
        .post('/purchases')
        .withJson({
          userId: 1,
          shopId: 3,
          points: 50,
        })
        .expectStatus(201);
    });
    it('Create fourth', () => {
      return pactum
        .spec()
        .post('/purchases')
        .withJson({
          userId: 1,
          shopId: 3,
          points: 90,
        })
        .expectStatus(201);
    });
  });

  // Award user
  describe('AwardUser', () => {
    it('Create first', () => {
      return pactum
        .spec()
        .post('/award-user')
        .withJson({
          userId: 1,
          awardId: 1,
        })
        .expectStatus(201);
    });
    it('Create second', () => {
      return pactum
        .spec()
        .post('/award-user')
        .withJson({
          userId: 2,
          awardId: 1,
        })
        .expectStatus(201);
    });
    it('Create third', () => {
      return pactum
        .spec()
        .post('/award-user')
        .withJson({
          userId: 1,
          awardId: 2,
        })
        .expectStatus(201);
    });
  });

  // Transaction
  describe('Transaction', () => {
    it('Show first page of transaction', async () => {
      return pactum.spec().get('/users/1/transactions').expectStatus(200);
    });
    it('Show second page of transaction', async () => {
      return pactum
        .spec()
        .get('/users/1/transactions?purchasesCursor=3&awardsCursor=3')
        .expectStatus(200);
    });
    it('Show third page of transaction', async () => {
      return pactum
        .spec()
        .get('/users/1/transactions?purchasesCursor=1&awardsCursor=1')
        .expectStatus(200);
    });
  });

  describe('Friend', () => {
    it('Send friend req from st user to nd user', () => {
      return pactum
        .spec()
        .post('/friends')
        .withJson({
          userId: 1,
          friendId: 2
        }).expectStatus(201);
    })
    it('Accept friend req from st user', () => {
      return pactum
        .spec()
        .patch('/friends/1')
        .withJson({
          userId: 1,
          friendId: 2,
          verifiedAt: true
        }).expectStatus(200);
    })
  })
});
