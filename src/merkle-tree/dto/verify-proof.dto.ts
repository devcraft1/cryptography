export class VerifyProofDTO {
  leaf: string;
  proof: { hash: string; position: 'left' | 'right' }[];
  root: string;
  algorithm?: string;
}
