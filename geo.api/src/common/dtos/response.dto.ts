export class ResponseDto<T = any> {
  constructor(
    public id: string,
    public data: T,
  ) {}
}
