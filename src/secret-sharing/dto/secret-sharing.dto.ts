export class SplitSecretDTO {
  secret: string;
  totalShares?: number;
  threshold?: number;
}

export class CombineSharesDTO {
  shares: { index: number; data: string }[];
}
