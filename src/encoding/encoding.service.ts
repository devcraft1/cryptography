import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class EncodingService {
  base64Encode(input: string) {
    const encoded = Buffer.from(input, 'utf-8').toString('base64');
    return { original: input, encoded, method: 'Base64' };
  }

  base64Decode(encoded: string) {
    try {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      return { encoded, decoded, method: 'Base64' };
    } catch {
      throw new BadRequestException('invalid base64 format');
    }
  }

  hexEncode(input: string) {
    const encoded = Buffer.from(input, 'utf-8').toString('hex');
    return { original: input, encoded, method: 'Hex' };
  }

  hexDecode(encoded: string) {
    try {
      const decoded = Buffer.from(encoded, 'hex').toString('utf-8');
      return { encoded, decoded, method: 'Hex' };
    } catch {
      throw new BadRequestException('invalid hex format');
    }
  }

  urlEncode(input: string) {
    const encoded = encodeURIComponent(input);
    return { original: input, encoded, method: 'URL Encoding' };
  }

  urlDecode(encoded: string) {
    const decoded = decodeURIComponent(encoded);
    return { encoded, decoded, method: 'URL Encoding' };
  }

  demonstrate() {
    const sample = 'Hello, World! <script>alert("xss")</script>';
    return {
      message:
        'Encoding is NOT encryption - it provides no security, only format conversion',
      sample,
      base64: this.base64Encode(sample),
      hex: this.hexEncode(sample),
      url: this.urlEncode(sample),
      keyPoint: 'Anyone can decode these without any key or secret',
    };
  }
}
