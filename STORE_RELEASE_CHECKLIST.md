# Ontiver mobile release checklist

## Required EAS environments

Configure `development`, `preview`, and `production` with the values documented in `.env.example`. Public Expo values are bundled into the application and must never contain private keys or client secrets. Configure Google service files, Sentry authentication, App Store Connect credentials, and the Google Play service-account file as EAS secret file variables.

Google Cloud must contain Web, iOS, and Android OAuth clients. Register `com.ontiverhq.ontiver`, the iOS reversed client-ID URL scheme, the EAS upload certificate SHA-1, and the Google Play app-signing SHA-1. Apple Developer must enable Sign in with Apple for `com.ontiverhq.ontiver` and point server notifications to `/auth/oauth/apple/events`.

## Store listing links

- Privacy: `https://ontiver.com/privacy`
- Terms: `https://ontiver.com/terms`
- Support: `https://ontiver.com/support`
- Account deletion: `https://ontiver.com/account-deletion`
- Marketing site: `https://ontiver.com`

## Reviewer notes

Ontiver is an 18+ identity wallet operated by Ontiver Inc., Nigeria. SmileID performs document, selfie, face, and liveness verification; Ontiver does not run its own face or liveness models. Reviewers need a dedicated verified test account and must be able to exercise email/password, Google, Apple on iOS, account linking, export, and deletion without using real customer data.

## Submission gates

- Complete Apple App Privacy and Google Play Data Safety answers from the actual production build and SDK inventory.
- Confirm camera, Face ID, notification, and photo permissions are purpose-limited and described at the moment of use.
- Verify in-app and web account-deletion flows, provider token revocation, support contact, and every legal URL.
- Run `npm run check`, `npm run doctor`, Android API 36 preview/production builds, and an iPhone production build.
- Test Apple and Google on physical devices signed with the same credentials used for store submission.
- Provide screenshots for supported phone sizes, content rating, Nigeria-first availability, release notes, and reviewer credentials.
