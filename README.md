# GameVault · Frontend Angular

Aplicación standalone Angular 22 para una biblioteca de videojuegos. Proyecto
independiente del backend.

## Arranque recomendado

Clona los repositorios con estos nombres locales para que el contexto Docker
encuentre el frontend. La infraestructura Keycloak/LDAP/PostgreSQL se mantiene
únicamente dentro del backend:

```bash
git clone https://github.com/A4N63L/cybersecurity-dashboard.git videojuegos-frontend
git clone https://github.com/A4N63L/cybersecurity-backend.git videojuegos-backend
cd videojuegos-backend
python3 scripts/setup_env.py
bash lab.sh up
```

Abre http://localhost:4200. Usa `alice` o `bob` en la página de Keycloak; sus
contraseñas son los valores `ALICE_PASSWORD` y `BOB_PASSWORD` del `.env` privado
generado en el backend. Ese archivo no se versiona. El frontend no necesita
secretos ni `client_secret`: el cliente OIDC es público y usa PKCE.

Consulta `../videojuegos-backend/README.md` para los detalles del Docker aislado
utilizado en Linux Mint Live, persistencia, credenciales y pruebas completas.

## Estructura y responsabilidades

```text
src/app/
├── core/auth/
│   ├── auth.service.ts             # Keycloak init/login/logout/renovación
│   ├── auth.guard.ts               # Protección de rutas
│   ├── auth.interceptor.ts         # Bearer solo para API de videojuegos
│   ├── demo-token.logger.ts        # Consola exclusivamente demo loopback
│   └── demo-token.logger.production.ts
├── features/login/
├── features/games/
│   ├── dashboard/                  # Listado, búsqueda, resumen, estados
│   ├── add-game/                   # Formulario reactivo independiente
│   ├── models/
│   └── services/                   # HttpClient
├── app.routes.ts                   # También procesa /auth/callback
├── app.config.ts
└── app.component.ts
```

Rutas públicas: `/login`, `/auth/callback`. Rutas protegidas: `/dashboard`,
`/games/new`. El guard espera la inicialización OIDC antes de decidir el acceso.

`AuthService` usa `keycloak-js` con Authorization Code + PKCE S256, state/nonce,
tokens en memoria y renovación antes de enviar solicitudes. No usa localStorage
para tokens ni recibe contraseñas. Un reload recupera la sesión mediante SSO.

El interceptor limita el JWT al origen de API configurado y a `/api/games`.
El POST muestra en consola el mismo access token que se adjunta después de
renovarlo. Nunca se envía el ID token al backend.

## Configuración

`src/environments/environment.ts` contiene las URLs locales y habilita la
demostración del JWT en consola, únicamente en loopback. La variante de
producción desactiva esa opción. Además, Angular reemplaza el módulo logger
por una función vacía para excluir el logging del bundle de producción.

El servidor de desarrollo dentro de Docker usa `0.0.0.0:4200` y Compose publica
exclusivamente `127.0.0.1:4200`. Navega con **localhost** para coincidir con CORS
y las redirecciones de Keycloak.

## Desarrollo con Node instalado en el host

Se requiere Node 24.15.0 o posterior de la rama 24 compatible con Angular 22.
Con Keycloak y el backend ya levantados:

```bash
npm ci
npm start
```

Libera primero el puerto del frontend Docker si vas a usar el servidor del host:
desde el backend, usa `bash lab.sh rm -s -f frontend`. Al terminar, vuelve a
iniciar el frontend Docker con `bash lab.sh up frontend`.

```bash
npm run build:demo   # Compilación de demostración
npm run build        # Compilación de producción, última salida en dist/gamevault
```

El Dockerfile compila ambas variantes y conserva la salida de producción.
La aplicación de la demostración se sirve con `ng serve` en configuración
development, por lo que el token se ve en consola local al iniciar sesión y agregar.

## Verificación

Desde el backend:

```bash
bash lab.sh exec -T frontend node verify-production.mjs
/tmp/opencode/browser-venv/bin/python tests/browser_demo.py
```

Playwright comprobó el flujo real con Chromium, sin mocks de Keycloak ni backend.
Las capturas y resultados están en `../videojuegos-backend/test-results/`.
El backend tiene una comprobación académica de formato Bearer, **no validación
criptográfica**; el guard no convierte esa API en una API segura contra tokens
falsificados. El alcance es la demostración local de la práctica.
