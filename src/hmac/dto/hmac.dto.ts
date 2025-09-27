export class HmacDTO {
  message: string;
  key: string;
}

export class HmacVerifyDTO extends HmacDTO {
  expectedHmac: string;
}