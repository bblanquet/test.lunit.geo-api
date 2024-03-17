import { Injectable } from '@nestjs/common';
import DbPool from '../../common/databases/dbPool';

@Injectable()
export class ContoursDao {
  private readonly _coordinates: string = 'coordinates';
  private readonly _id: string = 'id';
  private readonly _tablename: string = 'contours';

  constructor(private readonly _dbPool: DbPool) {}

  async findAll(): Promise<any[]> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinates) as ${this._coordinates} FROM ${this._tablename}`;
    return await this._dbPool.query(query, []);
  }

  async create(coordinates: number[][]): Promise<any> {
    const query = `INSERT INTO ${this._tablename} (coordinates) VALUES (ST_GeomFromText($1, 4326)) RETURNING id;`;
    const values = [
      `POLYGON((${coordinates.map((coo) => `${coo[0]} ${coo[1]}`).join(',')}))`,
    ];
    const rows = await this._dbPool.query(query, values);
    return rows[0];
  }

  async findOne(id: string): Promise<any> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinates) as ${this._coordinates} FROM ${this._tablename} where id = $1;`;
    const values = [id];
    const rows = await this._dbPool.query(query, values);
    return rows.length === 1 ? rows[0] : null;
  }

  async update(id: string, coordinates: number[][]): Promise<any> {
    const query = `UPDATE ${this._tablename} SET coordinates = $1 where id = $2 RETURNING id;`;
    const values = [
      `POLYGON((${coordinates.map((coo) => `${coo[0]} ${coo[1]}`).join(',')}))`,
      id,
    ];
    const rows = await this._dbPool.query(query, values);
    return rows[0];
  }

  async delete(id: string): Promise<any> {
    const query = `DELETE FROM ${this._tablename} where id = $1 RETURNING id;`;
    const values = [id];
    const rows = await this._dbPool.query(query, values);
    return rows.length === 1 ? rows[0] : null;
  }

  async interesect(id: string, contourId: string): Promise<any[]> {
    const query = `SELECT ST_AsText(ST_Intersection(a.coordinates, b.coordinates)) AS ${this._coordinates}
                    FROM contours AS a
                    JOIN contours AS b
                        ON a.id = $1 AND b.id = $2
                    WHERE ST_Intersects(a.coordinates, b.coordinates);`;
    const values = [id, contourId];
    const rows = await this._dbPool.query(query, values);
    return rows;
  }
}
