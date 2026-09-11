<p align="center">
  <a href="#" target="blank"><img src="https://res.cloudinary.com/dpxjhrv8s/image/upload/v1781116599/content_nhqpva.webp" width="220" alt="EnergyAPP Logo" /></a>
</p>

<h1 align="center">EnergyAPP - Frontend</h1>

<p align="center">
  <strong>Transformación digital y asistencia inteligente para la gestión deportiva.</strong>
  <br />
  Interfaz web para la administración integral y autogestión de EnergyClub.
</p>

<p align="center">
  <a href="https://nextjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/framework-Next.js-black.svg" alt="Framework Next.js">
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://img.shields.io/badge/styling-Tailwind_CSS-38B2AC.svg" alt="Styling Tailwind CSS">
  </a>
  <a href="https://tanstack.com/query/latest" target="_blank">
    <img src="https://img.shields.io/badge/data_fetching-TanStack_Query-FF4154.svg" alt="TanStack Query">
  </a>
  <a href="https://zustand.docs.pmnd.rs/" target="_blank">
    <img src="https://img.shields.io/badge/state-Zustand-orange.svg" alt="State Zustand">
  </a>
</p>

---

## Descripción

**EnergyAPP Frontend** es la plataforma cliente desarrollada en Next.js para modernizar y centralizar las operaciones diarias de **EnergyClub**. Proporciona una interfaz ágil tanto para el personal administrativo y propietarios como para los socios, integrando herramientas analíticas y consultas mediante lenguaje natural asistidas por Inteligencia Artificial.

### Características Principales
- **Dashboard Analítico & Alertas:** Indicadores en tiempo real sobre ingresos, socios activos, retención y alertas visuales para membresías próximas a vencer.
- **Gestión Operativa de Socios:** Tablas dinámicas con filtros, paginación, edición rápida, bajas lógicas y consulta integral de legajos.
- **Control de Planes y Cobranzas:** Asignación de suscripciones, parametrización de aranceles y registro ágil de pagos por múltiples medios (efectivo, transferencia, tarjeta).
- **Portal del Socio:** Espacio de autogestión privado donde cada cliente puede revisar su membresía, días restantes, fechas de corte e historial de cuotas pagadas.
- **Asistente Conversacional (IA):** Interfaz de chat integrada para consultar métricas del gimnasio mediante lenguaje natural con datos en tiempo real.
- **Seguridad en el Cliente:** Control de acceso basado en roles (RBAC: Administrador, Personal, Socio), rutas protegidas y manejo de tokens JWT.

### Stack Tecnológico
- **Framework:** Next.js (App Router)
- **Estilos:** Tailwind CSS
- **Peticiones HTTP & Caché:** Axios & TanStack Query (React Query)
- **Manejo de Estado Global:** Zustand
- **Formularios & Validación:** React Hook Form & Zod
- **Iconos:** Lucide React

---

## Puesta en Marcha (Modo Desarrollo)

Sigue esta guía paso a paso para configurar y ejecutar el proyecto frontend en tu entorno local.

### Prerrequisitos
Tener instalado el siguiente software:
- [Node.js](https://nodejs.org/es/) (v18 o superior)
- [Git](https://git-scm.com/)
- El backend de EnergyAPP (NestJS) ejecutándose localmente.

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Manuel0803/gym-project-front.git](https://github.com/Manuel0803/gym-project-front.git)
   cd frontend-energyapp
