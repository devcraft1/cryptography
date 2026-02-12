export class HkdfDeriveDTO {
  ikm: string;
  salt?: string;
  info?: string;
  keyLength?: number;
  hash?: string;
}
