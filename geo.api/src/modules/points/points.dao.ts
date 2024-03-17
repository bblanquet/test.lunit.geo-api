import { Injectable } from '@nestjs/common';
import DbPool from 'src/common/databases/dbPool';

@Injectable()
export class PointsDAO {
  private readonly _id: string = 'id';
  private readonly _coordinate: string = 'coordinate';
  private readonly _tablename: string = 'points';

  constructor(private readonly _dbPool: DbPool) {}

  async getPointById(id: string): Promise<any> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinate) as ${this._coordinate} FROM ${this._tablename} where id = $1`;
    const values = [id];
    const rows = await this._dbPool.query(query, values);
    return rows.length === 1 ? rows[0] : null;
  }

  async getAllPoints(): Promise<any[]> {
    const query = `SELECT id as ${this._id}, ST_AsText(coordinate) as ${this._coordinate} FROM ${this._tablename}`;
    return await this._dbPool.query(query, []);
  }

  async createPoint(coordinates: number[]): Promise<any> {
    const query = `INSERT INTO ${this._tablename} (coordinate) VALUES (ST_SetSRID(ST_MakePoint($1, $2), 4326)) RETURNING id;`;
    const values = [...coordinates];
    const rows = await this._dbPool.query(query, values);
    return rows[0];
  }

  async updatePoint(id: string, coordinates: number[]): Promise<any> {
    const query = `UPDATE ${this._tablename} SET coordinate = ST_SetSRID(ST_MakePoint($1, $2), 4326) where id = $3 RETURNING id;`;
    const values = [...coordinates, id];
    const rows = await this._dbPool.query(query, values);
    return rows[0];
  }

  async deletePoint(id: string): Promise<any> {
    const query = `DELETE FROM ${this._tablename} where id = $1 RETURNING id;`;
    const values = [id];
    const rows = await this._dbPool.query(query, values);
    return rows.length === 1 ? rows[0] : null;
  }

  async getPointsWithinContour(contourId: string): Promise<any[]> {
    const query = `SELECT points.id as ${this._id}, ST_AsText(points.coordinate) as ${this._coordinate}
        FROM ${this._tablename} JOIN contours ON ST_Contains(contours.coordinates, points.coordinate)
        WHERE contours.id = $1;`;
    const values = [contourId];
    return await this._dbPool.query(query, values);
  }
}
