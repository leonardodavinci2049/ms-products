import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/core/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          available: true,
        },
      }),

      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      data: product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    //const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // return this.product.delete({
    //   where: { id }
    // });

    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }
}
