# JSON Web Tokens

**Slug:** `json-web-tokens`
**Category:** Token-Based Authentication

> JSON Web Tokens (JWTs) are compact, URL-safe tokens for securely transmitting claims between parties, using digital signatures or MACs for integrity and optional encryption for confidentiality.

## Description

JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact, self-contained way to securely transmit information between parties as a JSON object. A JWT consists of three Base64url-encoded parts separated by dots: a header (specifying the algorithm and token type), a payload (containing claims — statements about an entity and additional metadata), and a signature (ensuring the token hasn't been tampered with).

JWTs can be signed using symmetric algorithms (HMAC-SHA256/HS256) or asymmetric algorithms (RSA-SHA256/RS256, ECDSA/ES256, EdDSA). Signed tokens (JWS — JSON Web Signature) verify integrity and authenticity. JWTs can also be encrypted (JWE — JSON Web Encryption) to provide confidentiality of the claims.

JWTs are widely used for authentication and authorization in web applications. After a user logs in, the server issues a JWT containing the user's identity and permissions. The client includes this token in subsequent requests (typically in the Authorization header), and the server verifies the signature without needing to look up a session in a database. This stateless property makes JWTs particularly suitable for distributed systems and microservice architectures.

## How It Works

1. The header specifies the signing algorithm (e.g., `"alg": "RS256"`) and token type (`"typ": "JWT"`). It is Base64url-encoded.
2. The payload contains claims: registered claims (iss, sub, exp, iat), public claims, and private claims. It is Base64url-encoded.
3. The signature is computed over the encoded header and payload: `signature = algorithm(base64url(header) + '.' + base64url(payload), secret_or_private_key)`.
4. The three parts are concatenated with dots to form the final JWT: `header.payload.signature`.
5. The recipient verifies the JWT by recomputing the signature using the secret (HMAC) or the public key (RSA/ECDSA/EdDSA) and comparing it to the received signature. Claims like `exp` (expiration) and `nbf` (not before) are also validated.

## Real-World Use Cases

- OAuth 2.0 and OpenID Connect use JWTs as access tokens and ID tokens for user authentication.
- Stateless session management in web applications, eliminating server-side session storage.
- API authentication in microservice architectures where services verify JWTs independently without a central session store.
- Single Sign-On (SSO) systems that issue JWTs to authenticate users across multiple applications.
- Webhook verification where the sender signs the payload as a JWT so the receiver can verify its authenticity.

## Security Considerations

- Always validate the `alg` header on the server side; never trust the algorithm specified in the token. The `none` algorithm attack allows unsigned tokens if not properly rejected.
- Use asymmetric algorithms (RS256, ES256, EdDSA) when the token verifier is different from the issuer to prevent secret key exposure.
- JWTs should have short expiration times (minutes, not days) and be paired with refresh tokens for session management.
- JWT payloads are Base64url-encoded, NOT encrypted. Sensitive data in the payload is visible to anyone. Use JWE if confidentiality is needed.
- Token revocation is difficult with stateless JWTs; consider token blocklists, short expiry, or reference tokens for revocable access.

## Alternatives

| Name | Comparison |
|------|-----------|
| Opaque (Reference) Tokens | Random token strings that must be validated by querying the authorization server. Easier to revoke but require a database lookup for every request. Better for sensitive applications needing immediate revocation. |
| PASETO (Platform-Agnostic Security Tokens) | A more opinionated alternative to JWT that eliminates algorithm negotiation pitfalls. Defines specific versions with fixed algorithms, reducing the attack surface. |
| Macaroons | Bearer tokens that support contextual caveats (conditions) which can be added by intermediaries. More flexible delegation model but more complex than JWTs. |

## References

- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [RFC 7515: JSON Web Signature (JWS)](https://datatracker.ietf.org/doc/html/rfc7515)
- [RFC 7516: JSON Web Encryption (JWE)](https://datatracker.ietf.org/doc/html/rfc7516)
