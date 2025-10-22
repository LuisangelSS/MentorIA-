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
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Preview](#preview)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Autores](#autores)

---

## Descripción

**MentorIA** es una plataforma de aprendizaje revolucionaria que utiliza inteligencia artificial para transformar la educación mediante un enfoque personalizado y adaptativo. 

A diferencia de los sistemas educativos tradicionales que aplican un modelo de **"talla única"**, MentorIA ajusta dinámicamente:
- 📊 Los contenidos según el progreso del estudiante
- 🎯 El nivel de dificultad adaptado a cada usuario
- 💬 La retroalimentación personalizada en tiempo real
- 🧩 El estilo de aprendizaje preferido

Todo esto impulsado por **Google Gemini AI** para proporcionar una experiencia educativa única y efectiva.

---

## Características principales

- 🤖 **Chat inteligente con IA**: Interactúa con MentorIA para resolver dudas y recibir explicaciones personalizadas
- 📊 **Dashboard de progreso**: Visualiza estadísticas, métricas y rendimiento académico
- 🎯 **Sistema de quizzes**: Genera evaluaciones personalizadas con IA sobre cualquier tema
- 💾 **Gestión de sesiones**: Organiza conversaciones por temas y mantiene historial
- 🔐 **Sistema de autenticación**: Registro e inicio de sesión seguro con gestión de sesiones
- 👤 **Perfiles de usuario**: Configuración personalizada y seguimiento del progreso
- 🎨 **Interfaz moderna**: Diseño responsivo con Tailwind CSS y efectos visuales atractivos
- 📱 **Diseño responsive**: Experiencia optimizada en dispositivos móviles, tablets y desktop
- 🌙 **Modo oscuro**: Interfaz diseñada para reducir la fatiga visual
- ⚡ **Rendimiento optimizado**: Carga rápida y navegación fluida
- ☁️ **Despliegue en la nube**: Disponible 24/7 en Vercel con base de datos Supabase

---

## Objetivo del proyecto

| Objetivo | Descripción |
|----------|-------------|
| 🎓 **Personalización** | Resolver la falta de personalización en sistemas educativos tradicionales |
| 💡 **Motivación** | Aumentar la motivación estudiantil mediante contenido ajustado a necesidades individuales |
| 📈 **Retención** | Mejorar la retención de conocimientos y el rendimiento académico |
| 🌐 **Accesibilidad** | Democratizar el acceso a educación de calidad adaptativa |
| 📊 **Analytics** | Proporcionar insights detallados del progreso de aprendizaje |

---

## Instalación y configuración

### Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** (v16 o superior)
- **npm** (v7 o superior)
- Una API Key de **Google Gemini**
- Una cuenta de **Supabase** (para base de datos)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/LuisangelSS/MentorIA-.git
cd MentorIA
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la carpeta `src/backend/` con el siguiente contenido:
```env
# Google Gemini API
GOOGLE_API_KEY=tu_api_key_de_gemini_aqui

# Supabase Configuration
SUPABASE_URL=tu_supabase_url_aqui
SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Server Configuration
PORT=3000
```

4. **Configurar base de datos Supabase**

Ejecuta el script de migración para crear las tablas necesarias:
```bash
npm run migrate
```

5. **Ejecutar el proyecto**

Para desarrollo:
```bash
npm run dev:full
```

Para producción:
```bash
npm start
```

6. **Acceder a la aplicación**

Abre tu navegador y visita: `http://localhost:3000`

---

## Arquitectura del proyecto

```
MentorIA/
│
├── 📄 .gitignore              # Archivos ignorados por Git
├── 📄 README.md               # Documentación del proyecto
├── 📦 package.json            # Dependencias y scripts npm
├── ⚙️ postcss.config.js       # Configuración de PostCSS
├── ⚙️ tailwind.config.js      # Configuración de Tailwind CSS
├── ⚙️ vercel.json             # Configuración de despliegue Vercel
│
├── 📁 api/                    # API para Vercel
│   └── index.js               # Handler de Vercel
│
├── 📁 docs/                    # Documentación adicional
│   └── doc.txt
│
└── 📁 src/
    │
    ├── 📁 backend/            # Lógica del servidor
    │   ├── 🔐 .env            # Variables de entorno (no en repo)
    │   ├── 🖥️ server.js       # Servidor Express principal
    │   ├── 🖥️ app.js          # Aplicación Express modular
    │   ├── 🗄️ db.js           # Gestión de base de datos Supabase
    │   ├── ☁️ supabase.js     # Configuración cliente Supabase
    │   │
    │   └── 📁 assets/
    │       └── ✨ particles.js # Efectos de partículas
    │
    └── 📁 frontend/           # Interfaz de usuario
        ├── 🏠 index.html      # Página de inicio
        ├── 🔑 login.html      # Página de login
        ├── 📝 registro.html   # Página de registro
        ├── 💬 app.html        # Aplicación principal (chat)
        ├── 📊 dashboard.html  # Dashboard de progreso
        ├── 🎯 quizzes.html    # Sistema de quizzes
        ├── 👤 profile.html    # Perfil de usuario
        ├── ❌ 404.html        # Página de error
        │
        ├── 📁 css/
        │   ├── 🎨 input.css   # Estilos base de Tailwind
        │   └── 🎨 style.css   # Estilos compilados
        │
        ├── 📁 js/
        │   ├── 💬 chat-sessions.js # Gestión de sesiones
        │   ├── 📊 dashboard.js    # Lógica del dashboard
        │   ├── 🔑 login.js        # Autenticación
        │   ├── 👤 profile.js      # Gestión de perfil
        │   ├── 🎯 quizzes.js      # Sistema de quizzes
        │   ├── 📝 registro.js     # Registro de usuarios
        │   ├── 🎨 script.js       # Funcionalidades generales
        │   ├── 👤 user.js         # Gestión de usuarios
        │   └── 🌙 theme-init.js  # Inicialización de tema
        │
        └── 📁 assets/
            ├── 📁 svg/
            │   ├── logo.svg
            │   ├── MentorIA-logo.svg
            │   └── github-mark.svg
            │
            └── 📁 png/
                └── ilustracion 1.png
```

### Descripción de componentes clave

- **`server.js`**: Servidor principal con Express que maneja todas las rutas y middleware
- **`app.js`**: Aplicación modular de Express exportable para Vercel
- **`db.js`**: Capa de acceso a datos con funciones para usuarios, sesiones, quizzes y chats
- **`supabase.js`**: Configuración del cliente Supabase para PostgreSQL
- **`dashboard.html`**: Interfaz del dashboard con métricas y estadísticas
- **`quizzes.html`**: Sistema de generación y resolución de quizzes con IA
- **`chat-sessions.js`**: Gestión avanzada de sesiones de conversación

---

## Stack tecnológico

### Backend
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Herramientas y Servicios
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

### Librerías destacadas
- **@google/genai**: SDK oficial de Google Gemini AI
- **@supabase/supabase-js**: Cliente oficial de Supabase
- **bcryptjs**: Encriptación de contraseñas
- **marked**: Renderizado de Markdown para respuestas de IA
- **particles.js**: Efectos visuales animados
- **AOS (Animate On Scroll)**: Animaciones al hacer scroll
- **Boxicons**: Iconografía moderna

---

## Funcionalidades

### Sistema de Autenticación
- ✅ Registro de usuarios con validación
- ✅ Inicio de sesión seguro
- ✅ Gestión de sesiones con tokens
- ✅ Verificación automática de sesión activa
- ✅ Cierre de sesión
- ✅ Actualización de perfil completo

### Chat con IA Avanzado
- 💬 Conversación en tiempo real con Google Gemini 2.5 Flash
- 🎓 Respuestas educativas personalizadas y adaptativas
- 📊 Adaptación del nivel de dificultad (básico, intermedio, avanzado)
- 📝 Formato Markdown en las respuestas
- 💾 Historial de conversaciones persistente
- 🗂️ Gestión de múltiples sesiones de chat
- 🏷️ Nombrado automático de conversaciones
- ⚡ Streaming de respuestas en tiempo real

### Sistema de Quizzes Inteligente
- 🎯 Generación automática de quizzes con IA
- 📚 10 preguntas por quiz sobre cualquier tema
- 🎚️ Tres niveles de dificultad configurables
- 📊 Sistema de puntuación y estadísticas
- 📈 Seguimiento de progreso detallado
- 🔄 Reintentos ilimitados
- 📋 Historial de quizzes realizados

### Dashboard de Progreso
- 📊 Métricas visuales del rendimiento
- 📈 Gráficos de progreso temporal
- 🎯 Estadísticas de quizzes completados
- 💯 Promedio de puntuaciones
- 📅 Actividad reciente
- 🏆 Distribución por dificultad

### Gestión de Sesiones
- 🗂️ Múltiples conversaciones organizadas
- 🏷️ Nombrado automático por IA
- 💾 Persistencia en base de datos
- 🗑️ Eliminación individual o masiva
- 🔄 Cambio entre sesiones activas

### Interfaz de Usuario
- 🎨 Diseño moderno con efectos de partículas
- 📱 Totalmente responsive
- 🌊 Animaciones suaves con AOS
- 🖼️ Iconos con Boxicons
- ⚡ Transiciones fluidas
- 🌙 Modo oscuro/claro persistente

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | `{ username, email, password }` |
| POST | `/login` | Iniciar sesión | `{ email, password }` |
| POST | `/logout` | Cerrar sesión | `{ token }` |
| GET | `/user-info` | Obtener info del usuario | Header: `Authorization: Bearer {token}` |

### Gestión de Perfil

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| PUT | `/profile/username` | Actualizar nombre de usuario | `{ newUsername }` |
| PUT | `/profile/email` | Actualizar email | `{ newEmail }` |
| PUT | `/profile/password` | Actualizar contraseña | `{ currentPassword, newPassword }` |
| PUT | `/profile/update-all` | Actualizar perfil completo | `{ newUsername, newEmail, currentPassword, newPassword }` |

### Chat con IA

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/chat` | Enviar mensaje a la IA | `{ prompt, chatSessionId?, stream? }` |

### Gestión de Sesiones de Chat

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/chats/sessions` | Listar sesiones del usuario | - |
| POST | `/chats/sessions` | Crear nueva sesión | `{ name? }` |
| GET | `/chats/:sessionId/messages` | Obtener mensajes de sesión | - |
| DELETE | `/chats/:sessionId` | Eliminar sesión específica | - |
| DELETE | `/chats` | Eliminar todas las sesiones | - |

### Sistema de Quizzes

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/quizzes/generate` | Generar quiz con IA | `{ topic, difficulty? }` |
| GET | `/quizzes/recent` | Listar quizzes recientes | - |
| GET | `/quizzes/:id` | Obtener quiz específico | - |
| POST | `/quizzes/:id/attempt` | Enviar respuestas del quiz | `{ answers }` |

### Dashboard y Progreso

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/progress/summary` | Resumen de progreso | - |

### Gestión de Cuenta

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| DELETE | `/user/delete-account` | Eliminar cuenta completa | - |

### Respuestas

**Éxito (200)**
```json
{
  "message": "Operación exitosa",
  "data": { ... }
}
```

**Error (400/401/500)**
```json
{
  "error": "Descripción del error"
}
```

---

## Preview

### 🚀 Demo en Vivo
**Accede a la aplicación:** [https://mentor-ia-tau.vercel.app/](https://mentor-ia-tau.vercel.app/)

### Aplicación Principal
![Landing Page](https://i.imgur.com/ZVw40XC.png)
*Interfaz del chat con IA y sidebar de navegación*

### Dashboard de Progreso
![Dashboard](https://i.imgur.com/dashboard-preview.png)
*Dashboard con métricas y estadísticas de aprendizaje*

### Sistema de Quizzes
![Quizzes](https://i.imgur.com/quizzes-preview.png)
*Generación y resolución de quizzes personalizados*

### Landing Page
![Login](https://i.imgur.com/0K0KPEd.png)
*Página de inicio con animaciones y efectos visuales*

### Página de Login
![Registro](https://i.imgur.com/V0bt0EU.png)
*Interfaz de inicio de sesión con validación en tiempo real*

### Página de Registro
![Chat](https://i.imgur.com/tOv5LmM.png)
*Formulario de registro con validaciones*

---

## Contribuir 

¡Las contribuciones son bienvenidas! Si quieres mejorar MentorIA:

1. **Fork** el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guías de contribución
- Sigue las convenciones de código del proyecto
- Documenta nuevas funcionalidades
- Añade tests cuando sea posible
- Actualiza el README si es necesario
- Asegúrate de que el código funcione tanto en desarrollo como en producción

### Áreas de mejora
- 🧪 Tests unitarios y de integración
- 📱 Mejoras en la experiencia móvil
- 🌍 Internacionalización (i18n)
- 🔍 Sistema de búsqueda en conversaciones
- 📊 Más tipos de visualizaciones en el dashboard
- 🤖 Integración con más modelos de IA

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

## Autores

**LuisangelSS** - 2023-1681 - Backend Developer & Full Stack

**elierdev** - 2023-1667 - Frontend Developer & UI/UX

[![GitHub LuisangelSS](https://img.shields.io/badge/GitHub-LuisangelSS-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LuisangelSS)
[![GitHub elierdev](https://img.shields.io/badge/GitHub-elierdev-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/elierdev)

---

## Agradecimientos

- Google Gemini por proporcionar la API de IA más avanzada
- Supabase por la infraestructura de base de datos en la nube
- Vercel por el hosting y despliegue automático
- La comunidad de código abierto
- Todos los contribuidores del proyecto

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

[⬆ Volver arriba](#)

</div>
