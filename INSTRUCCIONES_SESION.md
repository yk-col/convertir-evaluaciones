# Sistema de sesión unificado — CONVERTIR

## Archivos nuevos
- `sesion_promotor.html` — Página de acceso del promotor (reemplaza la entrada directa a las evaluaciones)
- `sesion_integracion.js` — Módulo que integra la sesión en cada evaluación
- `gestion_codigos.html` — Panel del administrador para crear/gestionar códigos

## Cómo funciona

### Flujo del promotor
1. Entra al portal → hace clic en cualquier evaluación → llega a `sesion_promotor.html`
2. Elige cómo ingresar (rápido / código / cuenta propia)
3. Sus datos se guardan en sessionStorage
4. Al entrar a cualquier evaluación, los campos se pre-rellenan y se bloquean automáticamente
5. Al terminar, el resultado se guarda en su historial local

### Integrar en las evaluaciones existentes
Agrega esta línea en el `<head>` de cada archivo de evaluación:
```html
<script src="sesion_integracion.js"></script>
```
Eso es todo. El módulo hace el resto automáticamente.

### Acceso por código
1. El administrador abre `gestion_codigos.html`
2. Crea un código para el promotor (ej: SPB-2026-001)
3. Le entrega el código al promotor
4. El promotor lo ingresa en la pestaña "Código promotor" de `sesion_promotor.html`

### Las 3 contraseñas de coordinadores (sin cambios)
- Antioquia: coord_ant_2026
- Centro: coord_cen_2026
- Eje Cafetero: coord_eje_2026
- Norte: coord_nor_2026
- Occidente: coord_occ_2026
- Oriente: coord_ori_2026

### Actualizar el portal
En `portal_CONVERTIR.html`, las 3 tarjetas de evaluación ya apuntan a `sesion_promotor.html`.
