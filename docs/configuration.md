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

## [Local Domains and HTTPS Setup](#local-domains-and-https-setup)

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
mkcert -install
```

## [Set up Cloudflare R2](#cloudflare-r2)

1. Follow the instructions in the **Cloudflare Account** section in the Convex R2 documentation. You need to create your own R2 bucket and set up the API key. Record these environment variables below and put them in your development Convex deployment

  ```
  R2_ACCESS_KEY_ID=
  R2_BUCKET=
  R2_ENDPOINT=
  R2_SECRET_ACCESS_KEY=
  R2_TOKEN=
  ```

2. Locate your newly created R2 bucket in the Cloudflare dashboard, enable [Public Development URL](https://developers.cloudflare.com/r2/buckets/public-buckets/#public-development-url). Record this environment variable below and put it in your development Convex deployment

  ```
  R2_PUBLIC_URL=
  ```

## [Setting up Better Auth with Convex in your environment](#better-auth)

1. Run pnpm install
2. Create the BETTER_AUTH_SECRET environment variable in your convex environment with the following command:
   `npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)`
3. Add your site url to your convex environment variables
   `npx convex env set SITE_URL https://localhost:3000`
   In prod, use the prod site url
4. Ensure you have VITE_CONVEX_SITE_URL set in your .env file in root directory.

For more details, visit this [guide](https://convex-better-auth.netlify.app/framework-guides/next)

Whenever you want to make changes to the betterAuth schemas and components, run the following command

```
cd convex/betterAuth
npx @better-auth/cli generate -y --output generatedSchema.ts
```

Note: the betterAuth tables can be accessed under the betterAuth component in the convex dash board.

![betterAuth](./images/betterAuth_component.png)

## [Setting up Resend](#resend)

We are using [Resend](https://resend.com) as our email provider. You have to:

1. Register a resend account
2. Get an API key
3. Verify your domain.
4. Ensure the RESEND_API_KEY environment variable is set in your convex environment with the API key value.
   For more information, follow the instructions [here](https://www.convex.dev/components/resend) to set up resend in your convex environment
   We will need an official verified domain if we want our emails to not go to the spam folder.

### Creating Users

To access the admin create user page without being an admin, comment out the if condition in app\admin\createuser\page.tsx.

You must manually set the user's role in the betterAuth.users table.

![admin](./images/better_auth_admin_set.png)

## [Cloudflare Turnstile](#cloudflare-turnstile)

Obtain a free site key and secret from the [Cloudflare Turnstile setup guide](https://developers.cloudflare.com/turnstile/get-started/). Reference the [Turnstile documentation](https://developers.cloudflare.com/turnstile/) for configuration details.

Set the following environment variables in `.env.local`:

- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_VERIFY_ENDPOINT`
- `VITE_TURNSTILE_SITE_KEY`

## [Configure Posthog](#posthog)

Add the following environment variables to your .env.local file:

VITE_PUBLIC_POSTHOG_KEY
VITE_PUBLIC_POSTHOG_HOST

Add the follwoing environment variables to your convex environment:

POSTHOG_API_KEY (same value as VITE_PUBLIC_POSTHOG_KEY)
POSTHOG_HOST (same value as VITE_PUBLIC_POSTHOG_HOST)

### Uploading source maps to Posthog

Detailed instructions for uploading source maps can be found at [here](https://posthog.com/docs/error-tracking/upload-source-maps)

Ensure the following environment variables are set up:
POSTHOG_CLI_HOST: The PostHog host to connect to [default: https://us.posthog.com]
POSTHOG_CLI_ENV_ID: PostHog project ID
POSTHOG_CLI_TOKEN: Personal API key with error tracking write and organization read scopes

Then run the following commands:

1. pnpm build
2. posthog-cli sourcemap inject --directory ./path/to/assets --project my-app --version 1.0.0
3. posthog-cli sourcemap upload --directory ./path/to/assets
