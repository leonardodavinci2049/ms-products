import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
