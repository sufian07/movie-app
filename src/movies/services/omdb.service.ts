import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OmdbDto } from '../dto/omdb.dto';

@Injectable()
export class OmdbService {
  constructor(private readonly config: ConfigService) {}

  async get(t: string): Promise<OmdbDto> {
    const apikey = this.config.get('OMDB_KEY');
    const url = this.config.get('OMDB_URL');
    const res = await axios.get(url, {
      params: { apikey, type: 'movie', t },
    });
    const { Title, Released, Genre, Director } = res.data;
    return { Title, Released, Genre, Director };
  }
}
