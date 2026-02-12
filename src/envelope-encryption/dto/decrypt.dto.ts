export class EnvelopeDecryptDTO {
  envelope: {
    encryptedData: string;
    dataIv: string;
    dataAuthTag: string;
    encryptedDek: string;
    dekIv: string;
    dekAuthTag: string;
  };
  masterKey: string;
}
