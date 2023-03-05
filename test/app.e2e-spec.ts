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
      password: '123',
    };
    describe('Signup', () => {
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(dto)
          .expectStatus(201);
      });
      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('Should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('Should throw if no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
    });

    describe('Signin', () => {
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('Should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('Should throw if no body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
    });
  });

  // User
  describe('User', () => {
    it('Should edit current user', async () => {
      const dto: UpdateUserDto = {
        email: 'second@test.com',
      };
      const user: User = await prisma.user.findUnique({
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
  });

  // Shop
  describe('Shop', () => {
    it('Create', () => {
      const createUserDto: CreateUserDto = {
        email: 'first@shop.com',
        password: 'password',
      };
      const createShopDto: CreateShopDto = {
        address: 'First Shop address',
        name: 'FirstShop',
        description: 'First shop desd',
      };
      return pactum
        .spec()
        .post('/shops')
        .withJson({ ...createUserDto, ...createShopDto })
        .expectStatus(201);
    });
  });

  // Award
  describe('Award', () => {
    describe('Create many', () => {
      it('Create award 1', () => {
        const createAwardDto: CreateAwardDto = {
          title: 'Award 1',
          quantity:100,
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
          shopId: 2,
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
          shopId: 2,
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
          shopId: 2,
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
          shopId: 2,
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
  })

  // Transaction
  describe('Transaction', () => {
    it('Show first page of transaction', async () => {
      return pactum
        .spec()
        .get('/users/1/transactions?purchasesCursor=4')
        .expectStatus(200).inspect();
    });
    it('Show second page of transaction', async () => {
    return pactum
      .spec()
      .get('/users/1/transactions?purchasesCursor=4&awardsCursor=1')
      .expectStatus(200);
    });
    it('Show third page of transaction', async () => {
    return pactum
      .spec()
      .get('/users/1/transactions?purchasesCursor=1&awardsCursor=1')
      .expectStatus(200);
    });
  });




});
