export class HkdfExpandDTO {
  ikm: string;
  salt?: string;
  labels: string[];
  keyLength?: number;
  hash?: string;
}
