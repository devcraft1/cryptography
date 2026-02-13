# X.509 Certificates

**Slug:** `x509-certificates`
**Category:** Public Key Infrastructure

> X.509 certificates bind a public key to an identity through a digitally signed document, forming the foundation of trust on the internet.

## Description

X.509 is an ITU-T standard that defines the format for public key certificates. An X.509 certificate contains a public key, identity information (such as a domain name or organization), validity dates, and is digitally signed by a Certificate Authority (CA). This signature allows anyone who trusts the CA to also trust the binding between the identity and the public key.

X.509 certificates are the backbone of TLS/SSL, the protocol that secures HTTPS connections. When a browser connects to a website, the server presents its X.509 certificate, and the browser verifies the chain of trust back to a trusted root CA embedded in the operating system or browser's trust store.

Certificates can be organized into hierarchical chains: a root CA signs intermediate CA certificates, which in turn sign end-entity (leaf) certificates. This chain-of-trust model allows delegation of signing authority while keeping root CA private keys highly protected and offline.

## How It Works

1. An entity generates a public/private key pair and creates a Certificate Signing Request (CSR) containing the public key and identity information.
2. The CSR is submitted to a Certificate Authority (CA), which validates the identity claim through domain validation, organization validation, or extended validation procedures.
3. The CA signs the certificate with its private key, binding the public key to the verified identity.
4. The signed certificate is installed on the server and presented to clients during the TLS handshake.
5. Clients verify the certificate by checking the CA's signature, the certificate's validity period, revocation status (via CRL or OCSP), and that the domain matches the certificate's Subject Alternative Name.

## Real-World Use Cases

- HTTPS/TLS connections for securing web traffic between browsers and servers.
- Code signing to verify that software has not been tampered with since publication.
- Email encryption and signing using S/MIME certificates.
- Client certificate authentication for mutual TLS (mTLS) in zero-trust architectures.
- IoT device identity and secure communication in industrial and consumer systems.

## Security Considerations

- The entire X.509 system depends on the trustworthiness of Certificate Authorities; a compromised CA can issue fraudulent certificates.
- Certificate revocation mechanisms (CRL, OCSP) have latency and availability issues, meaning revoked certificates may still be accepted temporarily.
- Certificates must be renewed before expiration to prevent service disruptions; automated renewal via ACME/Let's Encrypt is recommended.
- Weak key sizes or deprecated signature algorithms (e.g., SHA-1) make certificates vulnerable to forgery.
- Certificate Transparency (CT) logs help detect misissued certificates but require active monitoring.

## Alternatives

| Name | Comparison |
|------|-----------|
| Web of Trust (PGP/GPG) | A decentralized trust model where users vouch for each other's identities rather than relying on centralized CAs. More flexible but harder to scale and manage. |
| SPIFFE/SPIRE | A modern workload identity framework that provides short-lived X.509 certificates (SVIDs) for service-to-service authentication, designed for cloud-native environments. |
| SSH Certificates | A simpler certificate format used for SSH authentication. Less complex than X.509 but limited to SSH use cases. |

## References

- [RFC 5280: Internet X.509 Public Key Infrastructure Certificate and CRL Profile](https://datatracker.ietf.org/doc/html/rfc5280)
- [RFC 8555: Automatic Certificate Management Environment (ACME)](https://datatracker.ietf.org/doc/html/rfc8555)
- [Certificate Transparency — How CT Works](https://certificate.transparency.dev/howctworks/)
