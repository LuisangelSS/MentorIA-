# MentorIA – Plataforma de Aprendizaje Adaptativo con IA 🧠📚

<div align="center">

![MentorIA Banner](https://i.imgur.com/hA0vhl1.jpeg)

[![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[🚀 Demo en Vivo](https://mentor-ia-tau.vercel.app/) • [📖 Documentación](#documentación) • [🤝 Contribuir](#contribuir)

</div>

---

## 📋 Documentación

- [Descripción](#descripción)
- [Características principales](#características-principales)
- [Objetivo del proyecto](#objetivo-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
  - [Prerrequisitos](#prerrequisitos)
  - [Pasos de instalación](#pasos-de-instalación)
  - [Configuración de API Keys y Base de Datos](#configuración-de-api-keys-y-base-de-datos)
  - [Ejecutar el proyecto](#ejecutar-el-proyecto)
  - [Acceder a la aplicación](#acceder-a-la-aplicación)
  - [Resolución de problemas comunes](#resolución-de-problemas-comunes)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
  - [Descripción de componentes clave](#descripción-de-componentes-clave)
  - [Flujo de Datos (Ejemplo)](#flujo-de-datos-ejemplo)
- [Stack tecnológico](#stack-tecnológico)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Herramientas y Servicios](#herramientas-y-servicios)
  - [Librerías destacadas](#librerías-destacadas)
- [Funcionalidades](#funcionalidades)
  - [Sistema de Autenticación](#sistema-de-autenticación)
  - [Chat con IA Avanzado](#chat-con-ia-avanzado)
  - [Sistema de Quizzes Inteligente](#sistema-de-quizzes-inteligente)
  - [Dashboard de Progreso](#dashboard-de-progreso)
  - [Gestión de Sesiones](#gestión-de-sesiones)
  - [Interfaz de Usuario](#interfaz-de-usuario)
- [API Endpoints](#api-endpoints)
  - [Autenticación](#autenticación)
  - [Gestión de Perfil](#gestión-de-perfil)
  - [Chat con IA](#chat-con-ia)
  - [Gestión de Sesiones de Chat](#gestión-de-sesiones-de-chat)
  - [Sistema de Quizzes](#sistema-de-quizzes)
  - [Dashboard y Progreso](#dashboard-y-progreso)
  - [Gestión de Cuenta](#gestión-de-cuenta)
  - [Ejemplos de `curl`](#ejemplos-de-curl)
  - [Respuestas](#respuestas)
- [Preview](#preview)
- [Contribuir](#contribuir)
  - [Guías de contribución](#guías-de-contribución)
  - [Áreas de mejora](#áreas-de-mejora)
- [Licencia](#licencia)
- [Autores](#autores)
- [Agradecimientos](#agradecimientos)

---

## Descripción

**MentorIA** es una plataforma de aprendizaje adaptativo revolucionaria que utiliza **Inteligencia Artificial** para transformar la educación tradicional. Su misión principal es superar el modelo de "talla única" de los sistemas educativos convencionales, ofreciendo una experiencia de aprendizaje profundamente personalizada y dinámica. Impulsada por **Google Gemini AI**, MentorIA ajusta de manera inteligente los contenidos, el nivel de dificultad, la retroalimentación y el estilo de aprendizaje a las necesidades y progreso individual de cada estudiante, facilitando un proceso educativo más efectivo, motivador y accesible.

---

## Características principales

- 🤖 **Chat inteligente con IA**: Interactúa con un asistente de IA impulsado por Google Gemini para resolver dudas, obtener explicaciones detalladas y recibir apoyo académico personalizado.
- 📊 **Dashboard de progreso**: Visualiza tu rendimiento académico con estadísticas claras, métricas clave y un seguimiento detallado de tu evolución en la plataforma.
- 🎯 **Sistema de quizzes**: Genera evaluaciones personalizadas e instantáneas sobre cualquier tema, con preguntas adaptadas por la IA para reforzar el aprendizaje.
- 💾 **Gestión de sesiones**: Organiza tus conversaciones por temas, revisa tu historial de interacciones y retoma el aprendizaje donde lo dejaste fácilmente.
- 🔐 **Sistema de autenticación robusto**: Ofrece registro e inicio de sesión seguro, con gestión de sesiones para proteger tus datos y garantizar una experiencia fluida.
- 👤 **Perfiles de usuario personalizados**: Configura tus preferencias, actualiza tu información y sigue tu trayectoria académica en un espacio dedicado.
- 🎨 **Interfaz de usuario moderna y responsiva**: Disfruta de una experiencia visualmente atractiva y funcional en cualquier dispositivo (móvil, tablet, escritorio) gracias a un diseño adaptativo con Tailwind CSS.
- 🌙 **Modo oscuro**: Reduce la fatiga visual y mejora la comodidad durante sesiones de estudio prolongadas.
- ⚡ **Rendimiento optimizado**: Accede a una aplicación rápida y fluida, diseñada para una navegación sin interrupciones.
- ☁️ **Despliegue en la nube**: Garantiza la disponibilidad 24/7 de la plataforma a través de Vercel y una base de datos robusta con Supabase.

---

## Objetivo del proyecto

| Objetivo | Descripción | Impacto para el Usuario |
|----------|-------------|-------------------------|
| 🎓 **Personalización** | Resolver la falta de personalización en sistemas educativos tradicionales. | Cada estudiante recibe contenido y ritmo de aprendizaje adaptado a sus necesidades únicas. |
| 💡 **Motivación** | Aumentar la motivación estudiantil mediante contenido ajustado a necesidades individuales. | Un aprendizaje más relevante y menos frustrante, que mantiene al usuario comprometido. |
| 📈 **Retención** | Mejorar la retención de conocimientos y el rendimiento académico. | Facilita la comprensión profunda y la memorización a largo plazo de los temas estudiados. |
| 🌐 **Accesibilidad** | Democratizar el acceso a educación de calidad adaptativa. | Educación de alto nivel disponible para una audiencia más amplia, rompiendo barreras geográficas y económicas. |
| 📊 **Analytics** | Proporcionar insights detallados del progreso de aprendizaje. | Permite a los estudiantes y, potencialmente, a los educadores, identificar fortalezas y debilidades. |

---

## Instalación y configuración

Para poner en marcha MentorIA en tu entorno local, sigue los pasos detallados a continuación.

### Prerrequisitos

Asegúrate de tener instalado el siguiente software:
- **Node.js**: `v18.x` o superior (se recomienda la versión LTS). [Descargar Node.js](https://nodejs.org/en/download/)
- **npm**: `v9.x` o superior (viene con Node.js).
- Una API Key de **Google Gemini**: Necesaria para la funcionalidad de IA.
- Una cuenta de **Supabase**: Para la base de datos PostgreSQL y autenticación.

### Pasos de instalación

1.  **Clonar el repositorio**
    Comienza clonando el proyecto desde GitHub:
    ```bash
    git clone https://github.com/LuisangelSS/MentorIA-.git
    cd MentorIA- # Asegúrate de entrar al directorio correcto
    ```

2.  **Instalar dependencias**
    Navega al directorio raíz del proyecto e instala todas las dependencias necesarias:
    ```bash
    npm install
    ```

### Configuración de API Keys y Base de Datos

MentorIA depende de servicios externos para su funcionalidad principal.

1.  **Configurar variables de entorno**
    Crea un archivo `.env` en la *raíz del proyecto* (no en `src/backend/` como en el `README` anterior, ya que Vercel usa el `.env` en la raíz) con el siguiente contenido. **IMPORTANTE:** Nunca publiques este archivo en tu repositorio.

    ```env
    # Google Gemini API Key
    GOOGLE_API_KEY=tu_api_key_de_gemini_aqui

    # Supabase Configuration
    SUPABASE_URL=tu_supabase_url_aqui
    SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

    # Server Configuration (optional for local development, Vercel handles this)
    PORT=3000
    ```
    -   **Cómo obtener GOOGLE_API_KEY**: Visita [Google AI Studio](https://ai.google.dev/) y genera una nueva clave API.
    -   **Cómo obtener SUPABASE_URL y SUPABASE_ANON_KEY**:
        1.  Crea un nuevo proyecto en [Supabase](https://supabase.com/dashboard/projects).
        2.  Una vez creado, navega a `Project Settings` -> `API`.
        3.  Encontrarás `Project URL` y `anon public` key. Cópialas en tu archivo `.env`.

2.  **Configurar base de datos Supabase**
    Ejecuta el script de migración para crear las tablas necesarias en tu base de datos Supabase. Este comando probablemente se conecta a Supabase usando las variables de entorno.
    ```bash
    npm run migrate
    ```
    Este script inicializará la estructura de la base de datos necesaria para MentorIA (usuarios, sesiones de chat, quizzes, etc.).

### Ejecutar el proyecto

Puedes ejecutar el proyecto en modo desarrollo o producción:

-   **Para desarrollo (con hot-reloading y watchers):**
    ```bash
    npm run dev:full
    ```
    Este comando suele iniciar tanto el frontend como el backend y recompilará automáticamente los cambios.

-   **Para producción (optimizado y listo para despliegue):**
    ```bash
    npm start
    ```
    Este comando inicia el servidor Express optimizado para un rendimiento en producción.

### Acceder a la aplicación

Una vez que el servidor esté en funcionamiento, abre tu navegador web y visita:
`http://localhost:3000` (o el puerto que hayas configurado).

### Resolución de problemas comunes

-   **`npm install` falla**: Asegúrate de tener una versión de Node.js compatible (v18+). Intenta limpiar la caché de npm: `npm cache clean --force` y luego `npm install` de nuevo.
-   **Variables de entorno no cargadas**: Verifica que el archivo `.env` esté en la raíz del proyecto y que las variables estén definidas correctamente sin comillas. Reinicia el servidor después de cualquier cambio en `.env`.
-   **Conexión a Supabase fallida**: Revisa que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctas y que tu proyecto Supabase esté activo.
-   **Error de `npm run migrate`**: Asegúrate de que las credenciales de Supabase en `.env` sean correctas y que el script `migrate` tenga los permisos necesarios para interactuar con la base de datos.
-   **Puertos en uso**: Si el puerto 3000 ya está en uso, puedes cambiar la variable `PORT` en tu archivo `.env` a otro puerto disponible (ej. `PORT=4000`).

---

## Arquitectura del proyecto

MentorIA sigue una arquitectura modular con una clara separación entre el frontend y el backend, lo que facilita el desarrollo, mantenimiento y escalabilidad.

```
MentorIA/
│
├── 📄 .gitignore              # Archivos ignorados por Git
├── 📄 README.md               # Documentación principal del proyecto
├── 📦 package.json            # Dependencias y scripts npm
├── ⚙️ postcss.config.js       # Configuración de PostCSS para procesar CSS
├── ⚙️ tailwind.config.js      # Configuración de Tailwind CSS
├── ⚙️ vercel.json             # Configuración de despliegue en Vercel
├── 📄 .env                    # Variables de entorno (¡NO SUBIR A GIT!)
│
├── 📁 api/                    # Directorio para funciones serverless de Vercel
│   └── index.js               # Punto de entrada para las APIs de Vercel (maneja peticiones HTTP)
│
├── 📁 docs/                   # Documentación adicional (si la hay)
│   └── doc.txt
│
└── 📁 src/
    │
    ├── 📁 backend/            # Lógica del servidor (Express.js)
    │   ├── 🔐 .env            # Variables de entorno (usadas por `server.js` localmente, no por Vercel)
    │   ├── 🖥️ server.js       # Servidor Express principal para desarrollo/producción local
    │   ├── 🖥️ app.js          # Aplicación Express modular y exportable para Vercel
    │   ├── 🗄️ db.js           # Funciones de interacción con la base de datos (queries)
    │   ├── ☁️ supabase.js     # Configuración del cliente Supabase para interactuar con el DB
    │   │
    │   └── 📁 assets/         # Recursos del backend (ej. efectos de partículas para el servidor)
    │       └── ✨ particles.js # Implementación de efectos visuales (quizás para alguna UI generada por server)
    │
    └── 📁 frontend/           # Interfaz de usuario (HTML, CSS, JavaScript Vanilla)
        ├── 🏠 index.html      # Página de inicio/landing page
        ├── 🔑 login.html      # Interfaz para inicio de sesión
        ├── 📝 registro.html   # Interfaz para registro de nuevos usuarios
        ├── 💬 app.html        # Aplicación principal (interfaz del chat con IA)
        ├── 📊 dashboard.html  # Interfaz del dashboard de progreso
        ├── 🎯 quizzes.html    # Interfaz para el sistema de quizzes
        ├── 👤 profile.html    # Interfaz para la gestión del perfil de usuario
        ├── ❌ 404.html        # Página de error "no encontrado"
        │
        ├── 📁 css/
        │   ├── 🎨 input.css   # Archivo de entrada para Tailwind CSS (contiene directivas)
        │   └── 🎨 style.css   # Estilos CSS compilados de Tailwind (output)
        │
        ├── 📁 js/
        │   ├── 💬 chat-sessions.js # Lógica para gestionar las conversaciones del chat
        │   ├── 📊 dashboard.js    # Lógica para mostrar y actualizar el dashboard
        │   ├── 🔑 login.js        # Lógica para la autenticación de usuarios
        │   ├── 👤 profile.js      # Lógica para la gestión del perfil de usuario
        │   ├── 🎯 quizzes.js      # Lógica para la generación y manejo de quizzes
        │   ├── 📝 registro.js     # Lógica para el registro de nuevos usuarios
        │   ├── 🎨 script.js       # Funcionalidades JavaScript generales y globales
        │   ├── 👤 user.js         # Funciones y lógica relacionadas con los datos del usuario
        │   └── 🌙 theme-init.js  # Lógica para inicializar y gestionar el modo oscuro/claro
        │
        └── 📁 assets/            # Recursos estáticos del frontend
            ├── 📁 svg/           # Iconos SVG
            │   ├── logo.svg
            │   ├── MentorIA-logo.svg
            │   └── github-mark.svg
            │
            └── 📁 png/           # Imágenes PNG
                └── ilustracion 1.png
```

### Descripción de componentes clave

-   **`api/index.js`**: Este es el punto de entrada para el despliegue serverless en Vercel. Exporta una aplicación Express modular (`app.js`) para manejar las rutas de API, permitiendo que el backend funcione como una serie de funciones sin servidor.
-   **`src/backend/server.js`**: El servidor principal basado en Express que se utiliza para el desarrollo local. Configura los middleware, las rutas y la escucha de peticiones HTTP.
-   **`src/backend/app.js`**: Contiene la lógica central de la aplicación Express, incluyendo la definición de rutas y la integración con la base de datos y la IA. Se exporta para ser utilizado tanto por `server.js` (local) como por `api/index.js` (Vercel).
-   **`src/backend/db.js`**: Actúa como la capa de abstracción de la base de datos. Contiene funciones para todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con usuarios, sesiones de chat, quizzes y cualquier otro dato persistente.
-   **`src/backend/supabase.js`**: Configura y exporta el cliente de Supabase, proporcionando una interfaz para interactuar con la base de datos PostgreSQL de Supabase, la autenticación y el almacenamiento.
-   **`src/frontend/*.html`**: Archivos HTML que definen las diferentes vistas de la aplicación, desde la página de inicio hasta el chat principal, el dashboard y las páginas de autenticación.
-   **`src/frontend/js/*.js`**: Módulos JavaScript encargados de la interactividad del lado del cliente, la manipulación del DOM, la gestión de estado local y la comunicación con el backend a través de las API.
-   **`src/frontend/css/input.css` y `src/frontend/css/style.css`**: `input.css` es el archivo fuente de los estilos de Tailwind CSS, donde se aplican las directivas. `style.css` es el resultado compilado y optimizado que se sirve al navegador.

### Flujo de Datos (Ejemplo)

Consideremos el flujo de datos para una interacción de chat con IA:

1.  **Usuario (Frontend)**: Un usuario escribe un mensaje en la interfaz de chat (`app.html`) y lo envía.
2.  **JavaScript (Frontend)**: `chat-sessions.js` (o `script.js`) captura el mensaje y realiza una petición `POST` al endpoint `/chat` del backend.
3.  **Backend (API/Server)**:
    *   La petición llega a `api/index.js` (en Vercel) o `server.js` (local), que delega a `app.js`.
    *   `app.js` procesa la ruta `/chat`.
    *   Se utiliza `src/backend/supabase.js` para autenticar al usuario (si es necesario) y `src/backend/db.js` para guardar el mensaje del usuario en la base de datos.
    *   El mensaje se envía a la API de Google Gemini AI (utilizando `GOOGLE_API_KEY`).
    *   La respuesta de Gemini se recibe, se procesa (quizás formateando con `marked`) y se guarda en la base de datos a través de `db.js`.
    *   La respuesta de la IA se envía de vuelta al frontend.
4.  **Frontend (JavaScript)**: `chat-sessions.js` recibe la respuesta de la IA y la muestra en la interfaz del chat en tiempo real.

Este diseño asegura una clara división de responsabilidades y facilita la comprensión de cómo interactúan las diferentes partes del sistema.

---

## Stack tecnológico

MentorIA se construye sobre un stack tecnológico moderno y robusto, diseñado para escalabilidad, rendimiento y una excelente experiencia de desarrollo.

### Backend
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

-   **Node.js**: Entorno de ejecución de JavaScript del lado del servidor, elegido por su eficiencia, alto rendimiento para aplicaciones en tiempo real y vasto ecosistema de paquetes.
-   **Express.js**: Un framework web minimalista y flexible para Node.js, utilizado para construir las APIs RESTful de forma rápida y sencilla.
-   **Supabase**: Una alternativa de código abierto a Firebase, que proporciona una base de datos PostgreSQL, autenticación y almacenamiento de archivos, facilitando un backend robusto y escalable sin necesidad de configurar un servidor propio de base de datos.
-   **PostgreSQL**: Base de datos relacional de código abierto conocida por su fiabilidad, robustez de características y rendimiento. Es la base de datos subyacente de Supabase.
-   **Google Gemini AI**: La API de inteligencia artificial de última generación de Google, esencial para las funcionalidades de chat inteligente, generación de quizzes y personalización del aprendizaje.

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

-   **HTML5**: Lenguaje de marcado estándar para la creación de páginas web, utilizado para estructurar todo el contenido de la interfaz de usuario.
-   **CSS3**: Lenguaje de hojas de estilo utilizado para estilizar los componentes de la interfaz de usuario, trabajando en conjunto con Tailwind CSS para un diseño responsivo y estético.
-   **JavaScript (Vanilla)**: Lenguaje de programación principal del lado del cliente, encargado de la interactividad, la lógica de negocio del frontend y la comunicación asíncrona con el backend.
-   **Tailwind CSS**: Un framework CSS utilitario que permite construir interfaces de usuario personalizadas directamente en el marcado HTML, acelerando el desarrollo y manteniendo la consistencia visual.

### Herramientas y Servicios
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

-   **Vercel**: Plataforma de despliegue en la nube para aplicaciones web y funciones serverless, utilizada para el hosting rápido y automático de MentorIA.
-   **npm**: Gestor de paquetes oficial para Node.js, utilizado para instalar y gestionar las dependencias del proyecto.
-   **Git**: Sistema de control de versiones distribuido, fundamental para el seguimiento de cambios y la colaboración en el código fuente.
-   **GitHub**: Plataforma de alojamiento de repositorios Git, utilizada para el control de versiones, la colaboración y la gestión del proyecto.

### Librerías destacadas
-   **`@google/genai`**: SDK oficial de Google para interactuar con la API de Gemini AI, facilitando la integración de capacidades de IA.
-   **`@supabase/supabase-js`**: Cliente oficial de JavaScript para interactuar con los servicios de Supabase (Base de datos, Auth, Storage).
-   **`bcryptjs`**: Librería para el hashing de contraseñas, asegurando que las credenciales de los usuarios se almacenen de forma segura.
-   **`marked`**: Un analizador y compilador de Markdown de alto rendimiento, utilizado para renderizar las respuestas de la IA en un formato legible.
-   **`particles.js`**: Librería para crear efectos visuales animados de partículas, mejorando la estética de la interfaz.
-   **`AOS (Animate On Scroll)`**: Una librería de JavaScript para animar elementos al hacer scroll en la página, añadiendo dinamismo a la interfaz de usuario.
-   **`Boxicons`**: Colección de iconos de código abierto, utilizada para una iconografía moderna y consistente en toda la aplicación.

---

## Funcionalidades

MentorIA está diseñado con un conjunto robusto de funcionalidades para ofrecer una experiencia de aprendizaje completa y personalizada.

### Sistema de Autenticación
Un sistema de autenticación completo y seguro para gestionar el acceso de los usuarios.
-   ✅ **Registro de usuarios con validación**: Permite a los nuevos usuarios crear una cuenta con validación de datos en tiempo real.
-   ✅ **Inicio de sesión seguro**: Los usuarios pueden acceder a sus cuentas de forma segura mediante credenciales.
-   ✅ **Gestión de sesiones con tokens**: Utiliza tokens de sesión para mantener a los usuarios autenticados de forma segura sin requerir inicio de sesión constante.
-   ✅ **Verificación automática de sesión activa**: Comprueba si el usuario tiene una sesión válida al cargar la aplicación.
-   ✅ **Cierre de sesión**: Permite a los usuarios cerrar sus sesiones de forma segura.
-   ✅ **Actualización de perfil completo**: Los usuarios pueden modificar su nombre de usuario, correo electrónico y contraseña.

### Chat con IA Avanzado
El corazón de la personalización de MentorIA, impulsado por Google Gemini.
-   💬 **Conversación en tiempo real con Google Gemini 2.5 Flash**: Permite interacciones dinámicas y rápidas con la IA.
-   🎓 **Respuestas educativas personalizadas y adaptativas**: La IA ajusta sus explicaciones según el nivel de comprensión y el progreso del estudiante.
-   📊 **Adaptación del nivel de dificultad (básico, intermedio, avanzado)**: Los usuarios pueden elegir o la IA puede sugerir un nivel de dificultad para las explicaciones.
-   📝 **Formato Markdown en las respuestas**: Las respuestas de la IA se presentan con formato enriquecido para mayor claridad y legibilidad.
-   💾 **Historial de conversaciones persistente**: Todas las interacciones con la IA se guardan para su revisión posterior.
-   🗂️ **Gestión de múltiples sesiones de chat**: Organiza tus conversaciones en diferentes sesiones temáticas.
-   🏷️ **Nombrado automático de conversaciones**: La IA puede sugerir nombres relevantes para cada sesión de chat.
-   ⚡ **Streaming de respuestas en tiempo real**: Las respuestas de la IA se muestran a medida que se generan, ofreciendo una experiencia más fluida.

### Sistema de Quizzes Inteligente
Evaluaciones dinámicas y adaptativas para consolidar el conocimiento.
-   🎯 **Generación automática de quizzes con IA**: Crea cuestionarios personalizados sobre cualquier tema especificado por el usuario.
-   📚 **10 preguntas por quiz sobre cualquier tema**: Cada quiz está diseñado para ser conciso y enfocado.
-   🎚️ **Tres niveles de dificultad configurables**: Elige entre básico, intermedio o avanzado para desafiarte adecuadamente.
-   📊 **Sistema de puntuación y estadísticas**: Obtén feedback inmediato sobre tu rendimiento y un resumen detallado.
-   📈 **Seguimiento de progreso detallado**: Monitoriza tu evolución en los quizzes y áreas de mejora.
-   🔄 **Reintentos ilimitados**: Practica y mejora sin restricciones.
-   📋 **Historial de quizzes realizados**: Accede a todos tus quizzes anteriores y sus resultados.

### Dashboard de Progreso
Una visión general visual del rendimiento y las actividades del estudiante.
-   📊 **Métricas visuales del rendimiento**: Presentación gráfica de tu progreso de aprendizaje.
-   📈 **Gráficos de progreso temporal**: Visualiza cómo has mejorado a lo largo del tiempo.
-   🎯 **Estadísticas de quizzes completados**: Un resumen de cuántos quizzes has realizado y en qué temas.
-   💯 **Promedio de puntuaciones**: Tu calificación media en todos los quizzes.
-   📅 **Actividad reciente**: Un vistazo a tus últimas interacciones y logros.
-   🏆 **Distribución por dificultad**: Observa tu rendimiento en diferentes niveles de dificultad.

### Gestión de Sesiones
Organización eficiente de las interacciones para un aprendizaje estructurado.
-   🗂️ **Múltiples conversaciones organizadas**: Mantén tus chats separados por temas o proyectos.
-   🏷️ **Nombrado automático por IA**: Las sesiones se nombran inteligentemente para facilitar la identificación.
-   💾 **Persistencia en base de datos**: Todas las sesiones y sus contenidos se guardan de forma segura.
-   🗑️ **Eliminación individual o masiva**: Control total sobre tus datos de conversación.
-   🔄 **Cambio entre sesiones activas**: Alterna fácilmente entre diferentes líneas de conversación.

### Interfaz de Usuario
Diseñada para ser intuitiva, atractiva y funcional.
-   🎨 **Diseño moderno con efectos de partículas**: Una estética visual atractiva que mejora la experiencia del usuario.
-   📱 **Totalmente responsive**: Se adapta y funciona perfectamente en cualquier tamaño de pantalla.
-   🌊 **Animaciones suaves con AOS**: Transiciones y efectos visuales fluidos al interactuar con la página.
-   🖼️ **Iconos con Boxicons**: Utiliza un conjunto de iconos modernos y consistentes.
-   ⚡ **Transiciones fluidas**: Navegación sin interrupciones entre las diferentes vistas.
-   🌙 **Modo oscuro/claro persistente**: La preferencia de tema del usuario se guarda y se aplica automáticamente.

---

## API Endpoints

La aplicación MentorIA expone una serie de endpoints RESTful para interactuar con sus funcionalidades. Todos los endpoints que requieren autenticación esperan un token JWT en el encabezado `Authorization: Bearer <token>`.

### Autenticación

| Método | Endpoint | Descripción | Body (JSON) |
|--------|----------|-------------|-------------|
| `POST` | `/register` | Registra un nuevo usuario en la plataforma. | `{ "username": "...", "email": "...", "password": "..." }` |
| `POST` | `/login` | Inicia sesión y devuelve un token de autenticación. | `{ "email": "...", "password": "..." }` |
| `POST` | `/logout` | Invalida la sesión actual del usuario. | `{ "token": "..." }` (Generalmente, el token ya está en el encabezado) |
| `GET` | `/user-info` | Obtiene la información del usuario autenticado. | - |

### Gestión de Perfil

Requiere autenticación.

| Método | Endpoint | Descripción | Body (JSON) |
|--------|----------|-------------|-------------|
| `PUT` | `/profile/username` | Actualiza el nombre de usuario. | `{ "newUsername": "..." }` |
| `PUT` | `/profile/email` | Actualiza el correo electrónico del usuario. | `{ "newEmail": "..." }` |
| `PUT` | `/profile/password` | Cambia la contraseña del usuario. | `{ "currentPassword": "...", "newPassword": "..." }` |
| `PUT` | `/profile/update-all` | Actualiza múltiples campos del perfil simultáneamente. | `{ "newUsername": "...", "newEmail": "...", "currentPassword": "...", "newPassword": "..." }` |

### Chat con IA

Requiere autenticación.

| Método | Endpoint | Descripción | Body (JSON) |
|--------|----------|-------------|-------------|
| `POST` | `/chat` | Envía un mensaje a la IA y recibe una respuesta. | `{ "prompt": "...", "chatSessionId?": "uuid-v4", "stream?": true }` |

### Gestión de Sesiones de Chat

Requiere autenticación.

| Método | Endpoint | Descripción | Body (JSON) |
|--------|----------|-------------|-------------|
| `GET` | `/chats/sessions` | Lista todas las sesiones de chat del usuario. | - |
| `POST` | `/chats/sessions` | Crea una nueva sesión de chat. | `{ "name?": "Nombre de la sesión" }` |
| `GET` | `/chats/:sessionId/messages` | Obtiene todos los mensajes de una sesión específica. | - |
| `DELETE` | `/chats/:sessionId` | Elimina una sesión de chat específica y todos sus mensajes. | - |
| `DELETE` | `/chats` | Elimina todas las sesiones de chat del usuario. | - |

### Sistema de Quizzes

Requiere autenticación.

| Método | Endpoint | Descripción | Body (JSON) |
|--------|----------|-------------|-------------|
| `POST` | `/quizzes/generate` | Genera un nuevo quiz basado en un tema y dificultad. | `{ "topic": "...", "difficulty?": "easy" | "medium" | "hard" }` |
| `GET` | `/quizzes/recent` | Lista los quizzes recientes del usuario. | - |
| `GET` | `/quizzes/:id` | Obtiene los detalles de un quiz específico. | - |
| `POST` | `/quizzes/:id/attempt` | Envía las respuestas de un quiz para su calificación. | `{ "answers": [{ "questionId": "...", "selectedOptionId": "..." }] }` |

### Dashboard y Progreso

Requiere autenticación.

| Método | Endpoint | Descripción | Body (JSON) |
|--------|----------|-------------|-------------|
| `GET` | `/progress/summary` | Obtiene un resumen del progreso general del usuario. | - |

### Gestión de Cuenta

Requiere autenticación.

| Método | Endpoint | Descripción | Body (JSON) |
|--------|----------|-------------|------|
| `DELETE` | `/user/delete-account` | Elimina permanentemente la cuenta del usuario y todos sus datos. | - |

### Ejemplos de `curl`

**1. Registrar un nuevo usuario:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{ "username": "testuser", "email": "test@example.com", "password": "securepassword123" }' http://localhost:3000/register
```

**2. Iniciar sesión y obtener un token:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{ "email": "test@example.com", "password": "securepassword123" }' http://localhost:3000/login
```
*(Asumiendo que la respuesta incluye un token JWT)*

**3. Enviar un mensaje al chat con IA (requiere token):**
```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <TU_TOKEN_JWT>" -d '{ "prompt": "¿Qué es la fotosíntesis?", "stream": true }' http://localhost:3000/chat
```
*(Reemplaza `<TU_TOKEN_JWT>` con el token obtenido en el login)*

### Respuestas

**Éxito (200 OK)**
```json
{
  "message": "Operación exitosa",
  "data": {
    // Datos relevantes según el endpoint
  }
}
```

**Error (400 Bad Request / 401 Unauthorized / 500 Internal Server Error)**
```json
{
  "error": "Descripción del error específico"
}
```

---

## Preview

### 🚀 Demo en Vivo
**Accede a la aplicación en producción:** [https://mentor-ia-tau.vercel.app/](https://mentor-ia-tau.vercel.app/)

### Aplicación Principal
![Landing Page](https://i.imgur.com/ZVw40XC.png)
*Interfaz del chat con IA y sidebar de navegación, mostrando la interacción principal con el asistente inteligente.*

### Dashboard de Progreso
![Dashboard](https://i.imgur.com/dashboard-preview.png)
*Dashboard con métricas y estadísticas de aprendizaje, ofreciendo una visión clara del rendimiento y progreso del usuario.*

### Sistema de Quizzes
![Quizzes](https://i.imgur.com/quizzes-preview.png)
*Interfaz para la generación y resolución de quizzes personalizados, adaptados por la IA al tema y dificultad elegidos.*

### Landing Page
![Login](https://i.imgur.com/0K0KPEd.png)
*Página de inicio atractiva con animaciones sutiles y efectos visuales, diseñada para captar la atención del usuario.*

### Página de Login
![Registro](https://i.imgur.com/V0bt0EU.png)
*Interfaz de inicio de sesión con validación de formularios en tiempo real, garantizando una entrada segura y sin errores.*

### Página de Registro
![Chat](https://i.imgur.com/tOv5LmM.png)
*Formulario de registro intuitivo con validaciones robustas para nuevos usuarios, facilitando su incorporación a la plataforma.*

---

## Contribuir

¡Nos encantaría que contribuyeras a MentorIA! Tu ayuda es fundamental para mejorar esta plataforma de aprendizaje adaptativo. Aquí te explicamos cómo puedes sumarte:

1.  **Haz un Fork del Proyecto**: Crea una copia del repositorio en tu cuenta de GitHub.
2.  **Crea una Rama para tu Feature**: `git checkout -b feature/nombre-de-tu-feature-impresionante`
3.  **Realiza tus Cambios**: Implementa las mejoras o nuevas funcionalidades.
4.  **Haz Commit de tus Cambios**: `git commit -m 'feat: Añadir Awesome Feature'` (sigue las convenciones de Conventional Commits).
5.  **Envía tus Cambios a tu Rama**: `git push origin feature/nombre-de-tu-feature-impresionante`
6.  **Abre un Pull Request**: Dirige tu Pull Request a la rama `main` del repositorio original, describiendo detalladamente los cambios realizados.

### Guías de contribución
-   **Convenciones de Código**: Sigue un estilo de código consistente con el resto del proyecto (formato, nombres de variables, etc.).
-   **Documentación**: Documenta cualquier nueva funcionalidad o cambio importante en el código y, si es necesario, actualiza este `README.md`.
-   **Pruebas (Tests)**: Si es posible, añade pruebas unitarias o de integración para asegurar la funcionalidad y prevenir regresiones.
-   **Asegúrate de que el código funcione**: Verifica que tu código se ejecute correctamente tanto en entornos de desarrollo como de producción.
-   **Issues**: Si encuentras un bug o tienes una sugerencia, abre un "Issue" en GitHub.

### Áreas de mejora
Estamos buscando contribuciones en las siguientes áreas:
-   🧪 **Tests unitarios y de integración**: Implementación de un framework de pruebas y escritura de tests para las funcionalidades clave del backend y frontend.
-   📱 **Mejoras en la experiencia móvil**: Optimización adicional de la interfaz y la interactividad para dispositivos móviles.
-   🌍 **Internacionalización (i18n)**: Soporte para múltiples idiomas en la interfaz de usuario.
-   🔍 **Sistema de búsqueda en conversaciones**: Funcionalidad para buscar mensajes específicos dentro del historial de chat.
-   📊 **Más tipos de visualizaciones en el dashboard**: Incorporación de nuevos gráficos y métricas para un análisis más profundo del progreso.
-   🤖 **Integración con más modelos de IA**: Exploración y adición de compatibilidad con otras APIs o modelos de inteligencia artificial.

---

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` en la raíz del repositorio para más detalles.

---

## Autores

**LuisangelSS** - 2023-1681 - Backend Developer & Full Stack
[![GitHub LuisangelSS](https://img.shields.io/badge/GitHub-LuisangelSS-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LuisangelSS)

**elierdev** - 2023-1667 - Frontend Developer & UI/UX
[![GitHub elierdev](https://img.shields.io/badge/GitHub-elierdev-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/elierdev)

---

## Agradecimientos

-   **Google Gemini** por proporcionar la API de IA más avanzada y potente para el core de MentorIA.
-   **Supabase** por la infraestructura de base de datos en la nube fácil de usar y escalable.
-   **Vercel** por la plataforma de hosting y despliegue automático de alto rendimiento.
-   La **comunidad de código abierto** por las innumerables herramientas y recursos que hacen posibles proyectos como este.
-   Todos los **contribuidores** del proyecto por su tiempo, esfuerzo y dedicación.

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub para apoyar nuestro trabajo!**

[⬆ Volver arriba](#)

</div>
