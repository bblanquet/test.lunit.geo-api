import { Injectable } from '@nestjs/common';
import DbPool from 'src/common/databases/dbPool';

@Injectable()
export class ContoursDao {
  private readonly _coordinates: string = 'coordinates';
  private readonly _id: string = 'id';
  private readonly _tablename: string = 'contours';

  constructor(private readonly _dbPool: DbPool) {}

  async findAllContours(): Promise<any[]> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinates) as ${this._coordinates} FROM ${this._tablename}`;
    return await this._dbPool.query(query, []);
  }

  async createContour(coordinates: number[][]): Promise<any> {
    const query = `INSERT INTO ${this._tablename} (coordinates) VALUES (ST_GeomFromText($1, 4326)) RETURNING id;`;
    const values = [
      `POLYGON((${coordinates.map((coo) => `${coo[0]} ${coo[1]}`).join(',')}))`,
    ];
    const rows = await this._dbPool.query(query, values);
    return rows[0];
  }

  async findContourById(id: string): Promise<any> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinates) as ${this._coordinates} FROM ${this._tablename} where id = $1;`;
    const values = [id];
    const rows = await this._dbPool.query(query, values);
    return rows.length === 1 ? rows[0] : null;
  }

  async updateContour(id: string, coordinates: number[][]): Promise<any> {
    const query = `UPDATE ${this._tablename} SET coordinates = $1 where id = $2 RETURNING id;`;
    const values = [
      `POLYGON((${coordinates.map((coo) => `${coo[0]} ${coo[1]}`).join(',')}))`,
      id,
    ];
    const rows = await this._dbPool.query(query, values);
    return rows[0];
  }

  async deleteContour(id: string): Promise<any> {
    const query = `DELETE FROM ${this._tablename} where id = $1 RETURNING id;`;
    const values = [id];
    const rows = await this._dbPool.query(query, values);
    return rows.length === 1 ? rows[0] : null;
  }

  async findIntersectingContours(
    id: string,
    contourId: string,
  ): Promise<any[]> {
    const id1 = 'id1';
    const id2 = 'id2';
    const coos1 = 'coos1';
    const coos2 = 'coos2';
    const query = `SELECT a.id AS ${id1}, 
                        b.id AS ${id2},
                        ST_AsText(a.coordinates) AS ${coos1},
                        ST_AsText(b.coordinates) AS ${coos2}
                    FROM contours AS a
                    JOIN contours AS b
                        ON a.id = $1 AND b.id = $2
                    WHERE ST_Intersects(a.coordinates, b.coordinates);`;
    const values = [id, contourId];
    const rows = await this._dbPool.query(query, values);
    return rows;
  }
}
