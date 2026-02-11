import { Test, TestingModule } from '@nestjs/testing';
import { EncodingService } from './encoding.service';

describe('EncodingService', () => {
  let service: EncodingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncodingService],
    }).compile();
    service = module.get<EncodingService>(EncodingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('base64', () => {
    it('should encode to base64', () => {
      const result = service.base64Encode('Hello, World!');
      expect(result.encoded).toBe('SGVsbG8sIFdvcmxkIQ==');
      expect(result.method).toBe('Base64');
    });

    it('should decode from base64', () => {
      const result = service.base64Decode('SGVsbG8sIFdvcmxkIQ==');
      expect(result.decoded).toBe('Hello, World!');
    });

    it('should round-trip', () => {
      const input = 'test string with special chars: !@#$%';
      const encoded = service.base64Encode(input);
      const decoded = service.base64Decode(encoded.encoded);
      expect(decoded.decoded).toBe(input);
    });
  });

  describe('hex', () => {
    it('should encode to hex', () => {
      const result = service.hexEncode('AB');
      expect(result.encoded).toBe('4142');
    });

    it('should decode from hex', () => {
      const result = service.hexDecode('4142');
      expect(result.decoded).toBe('AB');
    });

    it('should round-trip', () => {
      const input = 'hex test';
      const encoded = service.hexEncode(input);
      const decoded = service.hexDecode(encoded.encoded);
      expect(decoded.decoded).toBe(input);
    });
  });

  describe('url', () => {
    it('should encode URL special characters', () => {
      const result = service.urlEncode('hello world&foo=bar');
      expect(result.encoded).toBe('hello%20world%26foo%3Dbar');
    });

    it('should decode URL encoding', () => {
      const result = service.urlDecode('hello%20world%26foo%3Dbar');
      expect(result.decoded).toBe('hello world&foo=bar');
    });

    it('should round-trip', () => {
      const input = 'a=1&b=2 c';
      const encoded = service.urlEncode(input);
      const decoded = service.urlDecode(encoded.encoded);
      expect(decoded.decoded).toBe(input);
    });
  });

  describe('demonstrate', () => {
    it('should return demo with all encoding types', () => {
      const result = service.demonstrate();
      expect(result.base64).toBeDefined();
      expect(result.hex).toBeDefined();
      expect(result.url).toBeDefined();
      expect(result.message).toContain('NOT encryption');
    });
  });
});
