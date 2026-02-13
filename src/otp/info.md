# One-Time Passwords (TOTP/HOTP)

**Slug:** `one-time-passwords`
**Category:** Authentication

> One-time passwords (OTPs) are short-lived, single-use codes generated using HMAC-based algorithms, providing a second authentication factor based on a shared secret.

## Description

One-time passwords (OTPs) are authentication codes that are valid for a single use or a short time period, providing an additional layer of security beyond static passwords. The two primary OTP algorithms are HOTP (HMAC-Based One-Time Password, RFC 4226) and TOTP (Time-Based One-Time Password, RFC 6238).

HOTP generates OTPs from an HMAC-SHA1 computation over a shared secret and a monotonically increasing counter. Each successful authentication increments the counter on both client and server. TOTP is an extension of HOTP that replaces the counter with the current Unix timestamp divided by a time step (typically 30 seconds), producing codes that expire automatically.

OTPs are the foundation of most two-factor authentication (2FA) systems. Authenticator apps (Google Authenticator, Authy, Microsoft Authenticator) implement TOTP, while some hardware tokens use HOTP. The shared secret is typically provisioned via a QR code containing an otpauth:// URI. Because the OTP is derived from a shared secret and a changing value (time or counter), it provides protection against password replay attacks even if the OTP is intercepted — it will have expired or been used before an attacker can leverage it.

## How It Works

1. A shared secret key (typically 160 bits) is generated on the server and securely provisioned to the user's device, often via a QR code containing an otpauth:// URI.
2. **For TOTP:** the current Unix timestamp is divided by the time step (default 30 seconds) to produce a counter value. **For HOTP:** a monotonically increasing counter is used.
3. An HMAC-SHA1 (or SHA-256/SHA-512) is computed over the counter value using the shared secret key, producing a 20-byte hash.
4. Dynamic truncation extracts a 4-byte value from the HMAC output at an offset determined by the last nibble of the hash, producing a 31-bit integer.
5. The integer is reduced modulo 10^d (where d is the desired digit count, typically 6) to produce the final OTP code displayed to the user.

## Real-World Use Cases

- Two-factor authentication (2FA) for web services using authenticator apps like Google Authenticator, Authy, or 1Password.
- Hardware security tokens (YubiKey in OATH mode) generating TOTP or HOTP codes for enterprise authentication.
- Banking and financial services use OTPs for transaction authorization and account login verification.
- VPN access requiring a second factor via TOTP-compatible tokens.
- SSH authentication with TOTP as a second factor using PAM modules.

## Security Considerations

- The shared secret must be transmitted securely during provisioning and stored encrypted on both the server and the client device.
- TOTP depends on clock synchronization; servers typically accept codes from a window of adjacent time steps (+/-1) to account for clock drift.
- HOTP requires server-side counter resynchronization mechanisms in case the client advances the counter without successful authentication.
- OTPs are vulnerable to real-time phishing and man-in-the-middle attacks where the attacker relays the code immediately. FIDO2/WebAuthn provides phishing-resistant alternatives.
- Backup codes should be provided for account recovery in case the authenticator device is lost; these must be stored securely and each used only once.

## Alternatives

| Name | Comparison |
|------|-----------|
| FIDO2/WebAuthn | A phishing-resistant authentication standard using hardware security keys or platform authenticators. Cryptographically bound to the origin (domain), preventing relay attacks. Stronger than OTP but requires compatible hardware. |
| SMS-Based OTP | Sends OTP codes via SMS text messages. Convenient but insecure due to SIM swapping, SS7 protocol vulnerabilities, and lack of encryption. Not recommended for high-security applications. |
| Push Notifications | Services like Duo and Microsoft Authenticator send push notifications for approval. Better UX than typing codes but still vulnerable to MFA fatigue (notification bombing) attacks. |

## References

- [RFC 4226: HOTP — An HMAC-Based One-Time Password Algorithm](https://datatracker.ietf.org/doc/html/rfc4226)
- [RFC 6238: TOTP — Time-Based One-Time Password Algorithm](https://datatracker.ietf.org/doc/html/rfc6238)
- [Google Authenticator Key URI Format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format)
