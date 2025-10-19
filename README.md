# MentorIA – Plataforma de Aprendizaje Adaptativo con IA 🧠📚

<div align="center">


![MentorIA Banner](https://i.imgur.com/hA0vhl1.jpeg)

[![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![SQLite](https://img.shields.io/badge/Sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Demo](#preview) • [📖 Documentacion](#-documentacion) • [🤝 Contribuir](#contribuir)

</div>

---

## 📋 Documentacion

- [Descripcion](#descripcion)
- [Caracteristicas principales](#caracteristicas-principales)
- [Objetivo del proyecto](#objetivo-del-proyecto)
- [Instalacion y configuracion](#instalacion-y-configuracion)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Stack tecnologico](#stack-tecnologico)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Preview](#preview)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Autores](#autores)

---

## Descripcion

**MentorIA** es una plataforma de aprendizaje revolucionaria que utiliza inteligencia artificial para transformar la educación mediante un enfoque personalizado y adaptativo. 

A diferencia de los sistemas educativos tradicionales que aplican un modelo de **"talla única"**, MentorIA ajusta dinámicamente:
- 📊 Los contenidos según el progreso del estudiante
- 🎯 El nivel de dificultad adaptado a cada usuario
- 💬 La retroalimentación personalizada en tiempo real
- 🧩 El estilo de aprendizaje preferido

Todo esto impulsado por **Google Gemini AI** para proporcionar una experiencia educativa única y efectiva.

---

## Caracteristicas principales

- 🤖 **Chat inteligente con IA**: Interactúa con MentorIA para resolver dudas y recibir explicaciones personalizadas
- 🔐 **Sistema de autenticación**: Registro e inicio de sesión seguro con gestión de sesiones
- 👤 **Perfiles de usuario**: Configuración personalizada y seguimiento del progreso
- 🎨 **Interfaz moderna**: Diseño responsivo con Tailwind CSS y efectos visuales atractivos
- 📱 **Diseño responsive**: Experiencia optimizada en dispositivos móviles, tablets y desktop
- 🌙 **Modo oscuro**: Interfaz diseñada para reducir la fatiga visual
- ⚡ **Rendimiento optimizado**: Carga rápida y navegación fluida

---

## Objetivo del proyecto

| Objetivo | Descripción |
|----------|-------------|
| 🎓 **Personalización** | Resolver la falta de personalización en sistemas educativos tradicionales |
| 💡 **Motivación** | Aumentar la motivación estudiantil mediante contenido ajustado a necesidades individuales |
| 📈 **Retención** | Mejorar la retención de conocimientos y el rendimiento académico |
| 🌐 **Accesibilidad** | Democratizar el acceso a educación de calidad adaptativa |

---

## Instalacion y configuracion

### Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** (v16 o superior)
- **npm** (v7 o superior)
- Una API Key de **Google Gemini**

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
GOOGLE_API_KEY=tu_api_key_aqui
PORT=3000
```

4. **Inicializar la base de datos**

La base de datos SQLite se creará automáticamente al iniciar el servidor por primera vez.

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
├── 🗄️ mentoria.db             # Base de datos SQLite
│
├── 📁 docs/                   # Documentación adicional
│   └── doc.txt
│
└── 📁 src/
    │
    ├── 🎨 input.css           # Estilos base de Tailwind
    │
    ├── 📁 backend/            # Lógica del servidor
    │   ├── 🔐 .env            # Variables de entorno (no en repo)
    │   ├── 🖥️ server.js       # Servidor Express y endpoints
    │   ├── 🗄️ db.js           # Gestión de base de datos SQLite
    │   ├── 💬 script.js       # Lógica del chat con IA
    │   ├── 🔑 login.js        # Lógica de inicio de sesión
    │   ├── 📝 registro.js     # Lógica de registro
    │   ├── 👤 user.js         # Gestión de usuarios
    │   │
    │   └── 📁 assets/
    │       └── ✨ particles.js # Efectos de partículas
    │
    └── 📁 frontend/           # Interfaz de usuario
        ├── 🏠 index.html      # Página de inicio
        ├── 🔑 login.html      # Página de login
        ├── 📝 registro.html   # Página de registro
        ├── 💬 app.html        # Aplicación principal (chat)
        │
        ├── 📁 css/
        │   └── 🎨 style.css   # Estilos compilados de Tailwind
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

- **`server.js`**: API REST con Express que maneja autenticación, chat con Gemini AI y gestión de usuarios
- **`db.js`**: Capa de acceso a datos con funciones para usuarios, sesiones y configuraciones
- **`app.html`**: Interfaz principal del chat con sidebar, header y área de conversación
- **`particles.js`**: Animaciones de fondo para mejorar la experiencia visual

---

## Stack tecnologico

### Backend
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/Sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Herramientas
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

### Librerías destacadas
- **bcryptjs**: Encriptación de contraseñas
- **better-sqlite3**: Base de datos SQLite optimizada
- **marked**: Renderizado de Markdown para respuestas de IA
- **particles.js**: Efectos visuales animados
- **AOS (Animate On Scroll)**: Animaciones al hacer scroll

---

## Funcionalidades

### Sistema de Autenticación
- ✅ Registro de usuarios con validación
- ✅ Inicio de sesión seguro
- ✅ Gestión de sesiones con tokens
- ✅ Verificación automática de sesión activa
- ✅ Cierre de sesión

### Chat con IA
- 💬 Conversación en tiempo real con Google Gemini
- 🎓 Respuestas educativas personalizadas
- 📊 Adaptación del nivel de dificultad (básico, intermedio, avanzado)
- 📝 Formato Markdown en las respuestas
- 💾 Historial de conversaciones

### Interfaz de Usuario
- 🎨 Diseño moderno con efectos de partículas
- 📱 Totalmente responsive
- 🌊 Animaciones suaves con AOS
- 🖼️ Iconos con Boxicons
- ⚡ Transiciones fluidas

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | `{ username, email, password }` |
| POST | `/login` | Iniciar sesión | `{ email, password }` |
| POST | `/logout` | Cerrar sesión | `{ token }` |
| GET | `/user-info` | Obtener info del usuario | Header: `Authorization: Bearer {token}` |

### Chat

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/chat` | Enviar mensaje a la IA | `{ prompt }` |

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

### Aplicación Principal
![Landing Page](https://i.imgur.com/ZVw40XC.png)
*Interfaz del chat con IA y sidebar de navegación*

---

### Landing Page
![Login](https://i.imgur.com/0K0KPEd.png)
*Página de inicio con animaciones y efectos visuales*

---

### Página de Login
![Registro](https://i.imgur.com/V0bt0EU.png)
*Interfaz de inicio de sesión con validación en tiempo real*

---

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

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

## Autores

**LuisangelSS** - 2023-1681 - Backend Developer

**elierdev** - 2023-1667 - Frontend Developer

[![GitHub LuisangelSS](https://img.shields.io/badge/GitHub-LuisangelSS-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LuisangelSS)
[![GitHub elierdev](https://img.shields.io/badge/GitHub-elierdev-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/elierdev)

---

## Agradecimientos

- Google Gemini por proporcionar la API de IA
- La comunidad de código abierto
- Todos los contribuidores del proyecto

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**

[⬆ Volver arriba](#mentoria--plataforma-de-aprendizaje-adaptativo-con-ia-)

</div>
