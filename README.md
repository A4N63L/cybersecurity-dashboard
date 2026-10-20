# GameVault · Frontend Angular

Angular 22, Authorization Code + PKCE S256 con `keycloak-js`, tokens en memoria
y renovación antes de enviar solicitudes. El interceptor limita Bearer al origen
de API configurado y a `/api/games`. El código no imprime JWT en ninguna variante.

## Arranque del laboratorio

Coloca los tres proyectos como carpetas hermanas:

```text
Ciberseguridad/
├── videojuegos-frontend/
├── videojuegos-backend/
└── videojuegos-auth/
```

Desde `videojuegos-backend`:

```bash
python3 scripts/setup_env.py  # solo si falta .env; preserva uno existente
bash lab.sh up
bash lab.sh ps -a
```

Abre **http://localhost:4200**. Credenciales locales de `alice` y `bob` en el
`.env` privado del backend. Keycloak recibe las contraseñas y emite el JWT;
OpenLDAP comprueba los usuarios a través de LDAPS.

El Dockerfile compila Angular en una etapa Node 24 y sirve los archivos de
producción mediante Nginx en 4200. El fallback SPA mantiene `/auth/callback`,
`/dashboard` y `/games/new`. El puerto publicado sigue siendo `127.0.0.1:4200`.

La etapa final incorpora Python, Fail2Ban e iptables. Las configuraciones comunes
se toman del contexto adicional `security` de `../videojuegos-auth/common`.
Para construir mediante Compose utiliza `lab.sh`; no basta con `docker build .`
sin proporcionar ese contexto adicional.

## Protección

- Jail `http-flood`: 60 peticiones/IP en 10 segundos, veto inicial 10 minutos,
  incremento por reincidencia hasta 1 día.
- Log regular `/var/log/security/access.log`: IP del socket, fecha, método,
  ruta sin consulta y estado; sin cabeceras ni cuerpo.
- Fail2Ban instala reglas INPUT dentro del contenedor con `NET_ADMIN`.
- El supervisor PID 1 detiene el contenedor con error si Nginx o Fail2Ban sale.
- El healthcheck comprueba HTTP y Fail2Ban.

## Desarrollo y comprobación

Con Node 24 compatible con Angular 22: `npm ci`, `npm start`, `npm run build`.
El servidor local de desarrollo no sustituye a la imagen protegida de la práctica.
`npm run build:demo` conserva una compilación development, sin logger de tokens.

`verify-production.mjs` se ejecuta durante la construcción, cuando Node está
disponible. El runtime Nginx no incluye Node.

Desde el backend:

```bash
/tmp/opencode/browser-venv/bin/python tests/browser_demo.py
python3 tests/security_checks.py
python3 tests/supervisor_checks.py
python3 tests/audit_logs.py
```

Playwright comprueba login de ambos usuarios, callback PKCE, renovación real,
alta, listado, recarga, logout y ausencia de JWT en consola. Las evidencias locales
quedan en `videojuegos-backend/test-results/`, fuera de Git. Consulta el README
del backend para instalar Playwright y arrancar el daemon correcto.
