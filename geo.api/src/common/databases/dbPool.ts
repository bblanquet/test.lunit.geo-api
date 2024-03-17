import { Pool, QueryResult } from 'pg';
import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//singleton
@Injectable({ scope: Scope.DEFAULT })
class DbPool {
  private pool: Pool;
  constructor(private configService: ConfigService) {
    const conf = {
      host: this.configService.get<string>('db.host'),
      database: this.configService.get<string>('db.database'),
      user: this.configService.get<string>('db.user'),
      password: this.configService.get<string>('db.password'),
      port: this.configService.get<number>('db.port'),
    };

    this.pool = new Pool(conf);
  }

  public async query(query: string, values?: any[]): Promise<any[] | null> {
    console.log('Query:', query);
    if (values) {
      console.log('Query values:', values.join(', '));
    }
    const client = await this.pool.connect();
    const result: QueryResult<any> = await client.query(query, values);
    console.log('Query result:', result.rows);
    client.release();
    return result.rows;
  }
}

export default DbPool;
