import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MoviesModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
