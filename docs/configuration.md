# Configuration

## Environment Variables

Two sets of environment variables are required: one for the Convex backend and one for the TanStack frontend.

### Convex Backend

A template can be found in `convex/.env.example`. Set values in your Convex environment either through the dashboard or via the CLI:

```bash
npx convex env set VARIABLE_NAME=value
```

### Local TanStack Development

Use `.env.example` in the project root as a starting point:

```bash
cp .env.example .env.local
```

Fill in the required values after copying.

## Local Domains and HTTPS Setup

### Local Domain Mapping

Add the following entry to your hosts file (macOS/Linux: `/etc/hosts`, Windows: `C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1 club-freedom.local
```

Flush DNS after editing:

```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns
```

### SSL Certificate Generation

Install [mkcert](https://github.com/FiloSottile/mkcert) and generate local certificates:

```bash
mkdir -p ./certificates
mkcert -cert-file ./certificates/dev.pem -key-file ./certificates/dev-key.pem localhost 127.0.0.1
```

## Cloudflare Turnstile

Obtain a free site key and secret from the [Cloudflare Turnstile setup guide](https://developers.cloudflare.com/turnstile/get-started/). Reference the [Turnstile documentation](https://developers.cloudflare.com/turnstile/) for configuration details.

Set the following environment variables in `.env.local`:

- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_VERIFY_ENDPOINT`
- `VITE_TURNSTILE_SITE_KEY`
