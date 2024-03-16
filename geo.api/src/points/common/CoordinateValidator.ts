export class CoordinateValidator {
  public validate(x: number, y: number): boolean {
    return -180 <= x && x <= 180 && -90 <= y && y <= 90;
  }
}
