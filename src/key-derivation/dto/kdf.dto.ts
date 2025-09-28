export class KdfDTO {
  password: string;
  salt?: string;
  iterations?: number;
  keyLength?: number;
}

export class Pbkdf2DTO extends KdfDTO {
  algorithm?: string;
}

export class ScryptDTO extends KdfDTO {
  N?: number;
  r?: number;
  p?: number;
}