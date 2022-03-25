import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dto/movies.dto';

@Injectable()
export class MoviesService {
  create(data: CreateDto) {}
}
