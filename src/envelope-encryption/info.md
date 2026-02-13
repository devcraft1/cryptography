# Envelope Encryption

**Slug:** `envelope-encryption`
**Category:** Encryption Architecture

> Envelope encryption is a strategy where data is encrypted with a data encryption key (DEK), which is itself encrypted with a separate key encryption key (KEK), enabling scalable key management.

## Description

Envelope encryption is a key management pattern where data is encrypted using a unique data encryption key (DEK), and the DEK itself is encrypted (wrapped) using a key encryption key (KEK), also known as a master key or wrapping key. The encrypted DEK is stored alongside the encrypted data, forming an "envelope" that contains everything needed for decryption — except the KEK.

This two-tier approach solves a fundamental problem in key management: how to encrypt large volumes of data while keeping the most sensitive key material in a secure, centralized location (such as a hardware security module or cloud KMS). The KEK never needs to leave the secure boundary; only DEKs pass in and out for wrapping and unwrapping operations.

Envelope encryption is the standard pattern used by all major cloud providers' key management services (AWS KMS, Google Cloud KMS, Azure Key Vault). Each piece of data or data partition gets its own unique DEK, limiting the blast radius of any single key compromise. The KEK can be rotated independently — only the DEKs need to be re-wrapped, not the underlying data.

## How It Works

1. A unique Data Encryption Key (DEK) is generated, typically a random 256-bit AES key.
2. The DEK is used to encrypt the actual data using a symmetric algorithm like AES-GCM.
3. The DEK is then encrypted (wrapped) using the Key Encryption Key (KEK), which is held in a secure key management system.
4. The encrypted data and the wrapped (encrypted) DEK are stored together. The plaintext DEK is discarded from memory.
5. To decrypt, the wrapped DEK is sent to the key management system for unwrapping, and the resulting plaintext DEK is used to decrypt the data.

## Real-World Use Cases

- AWS KMS encrypts S3 objects, EBS volumes, and RDS databases using envelope encryption with customer-managed master keys.
- Google Cloud KMS uses envelope encryption for encrypting data across Google Cloud services.
- Database column-level encryption where each column or row group has its own DEK wrapped by a central KEK.
- Email encryption (S/MIME, PGP) uses the same pattern: a random session key encrypts the message body, and the session key is encrypted with the recipient's public key.
- Backup encryption systems that need to encrypt terabytes of data while supporting key rotation without re-encrypting all data.

## Security Considerations

- The KEK is the most critical secret; it must be stored in a hardware security module (HSM) or managed key service with strict access controls.
- Each encryption operation should use a unique DEK to limit the impact of a single key compromise.
- DEK material must be securely erased from memory after use to prevent extraction through memory dumps.
- KEK rotation should re-wrap existing DEKs under the new KEK without requiring re-encryption of the underlying data.
- Access to the key management system must be audited and controlled; anyone who can call the unwrap API can access the data.

## Alternatives

| Name | Comparison |
|------|-----------|
| Direct Encryption | Encrypting all data with a single master key. Simpler but riskier: key compromise exposes all data, and key rotation requires re-encrypting everything. |
| Key Wrapping (AES-KW) | A specific algorithm for securely wrapping keys. Often used as the KEK wrapping mechanism within an envelope encryption scheme. |
| Multi-Tier Key Hierarchy | An extension of envelope encryption with three or more tiers (e.g., root key -> zone key -> DEK), providing finer-grained access control at the cost of additional complexity. |

## References

- [AWS KMS Concepts: Envelope Encryption](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping)
- [Google Cloud — Envelope Encryption](https://cloud.google.com/kms/docs/envelope-encryption)
- [NIST SP 800-57 Part 1: Recommendation for Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
