import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { ClientModule } from './client/client.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { ReportModule } from './report/report.module';
import { HealthModule } from './health/health.module';
import { S3Module } from './s3/s3.module';
import { MetricsModule } from './metrics/metrics.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    ClientModule,
    CategoryModule,
    OrderModule,
    CartModule,
    ReportModule,
    HealthModule,
    S3Module,
    MetricsModule
  ],
  providers: [PrismaService],
})
export class AppModule { }