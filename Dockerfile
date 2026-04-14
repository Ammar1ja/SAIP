# Install dependencies only when needed
FROM node:22-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json next.config.ts ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENV NEXT_PUBLIC_SAIP_ENV="test" \
        NEXT_PUBLIC_BASE_URL="https://gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa" \
        NEXT_PUBLIC_FRONTEND_URL="https://gp-saip-portals-website-frontend-v3.test.internal.saip.gov.sa" \
        NEXTAUTH_URL="https://gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa" \
        NEXT_PUBLIC_NEXTAUTH_URL="https://gp-saip-portals-website-backend-v3.test.internal.saip.gov.sa" \
    NEXT_PUBLIC_KEYCLOAK_ID="tstcorebusinessapplicantsclient" \
        NEXT_PUBLIC_KEYCLOAK_SECRET="G9q3wWKKryBJD38I3G9fi9L1wCOTrdp9" \
        NEXT_PUBLIC_KEYCLOAK_ISSUER="https://keycloak.test.internal.saip.gov.sa/auth/realms/tstcorebusinessapplicants" \
        NEXT_PUBLIC_NEXTAUTH_SECRET="Y+ToBhv7e0rGOR+rwvm6M31thrlUr4hR/iGj9LS6m8I="
RUN npm run build

# Production image, copy all the files and run next
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./

COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "start"]
