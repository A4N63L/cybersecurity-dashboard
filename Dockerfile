FROM node:24-alpine AS build
WORKDIR /app
ENV NG_CLI_ANALYTICS=false NG_BUILD_MAX_WORKERS=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build
RUN node verify-production.mjs

FROM nginx:1.28-alpine
RUN apk add --no-cache fail2ban python3 iptables
COPY --from=build /app/dist/gamevault/browser /usr/share/nginx/html
COPY --from=security / /opt/security/
COPY --from=security jail.local /etc/fail2ban/jail.local
COPY --from=security http-flood.conf /etc/fail2ban/filter.d/http-flood.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY security-processes.json /etc/security-processes.json
RUN mkdir -p /var/log/security
EXPOSE 4200
ENV HEALTH_URL=http://127.0.0.1:4200/
ENTRYPOINT ["python3", "/opt/security/supervise.py"]
HEALTHCHECK CMD python3 /opt/security/health.py
