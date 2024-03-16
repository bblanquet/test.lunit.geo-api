import { GeoType } from './GeoType';

export interface GeoData {
  type: GeoType;
  coordinates: Array<number>;
}
