# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

agroap-ui/
├── src/
│   ├── assets/                 # Recursos estáticos como imágenes y iconos.
│   │   └── react.svg
│   ├── components/             # Componentes reutilizables de la interfaz de usuario.
│   │   ├── BarterProposalCard.jsx  # Tarjeta para mostrar detalles de una propuesta de trueque.
│   │   ├── Navbar.jsx          # Barra de navegación principal.
│   │   ├── PremiumRoute.jsx    # Componente de ruta protegida para usuarios Premium.
│   │   ├── PrivateRoute.jsx    # Componente de ruta protegida para usuarios autenticados.
│   │   ├── ProductCard.jsx     # Tarjeta para mostrar detalles de un producto.
│   │   └── Spinner.jsx         # Indicador de carga.
│   ├── context/                # Contextos de React para gestión de estado global.
│   │   └── AuthContext.jsx     # Maneja el estado de autenticación del usuario.
│   ├── hooks/                  # Hooks personalizados de React.
│   │   └── useAuth.js          # Hook para acceder al contexto de autenticación.
│   ├── pages/                  # Vistas principales de la aplicación (páginas).
│   │   ├── BarterDetailsPage.jsx       # Detalles de una propuesta de trueque específica.
│   │   ├── BarterProposalPage.jsx      # Página para crear o visualizar propuestas de trueque.
│   │   ├── CartPage.jsx                # Carrito de compras.
│   │   ├── CheckoutPage.jsx            # Proceso de finalización de compra.
│   │   ├── CreateBarterProposalPage.jsx # Formulario para crear una nueva propuesta de trueque.
│   │   ├── CreateCounterProposalPage.jsx # Formulario para crear una contrapropuesta.
│   │   ├── CreateProductPage.jsx       # Formulario para crear un nuevo producto.
│   │   ├── CreateRentalPage.jsx        # Formulario para crear una nueva oferta de alquiler.
│   │   ├── CreateServicePage.jsx       # Formulario para crear un nuevo servicio.
│   │   ├── DashboardPage.jsx           # Panel de control del usuario.
│   │   ├── EditProductPage.jsx         # Formulario para editar un producto existente.
│   │   ├── HomePage.jsx                # Página de inicio.
│   │   ├── LoginPage.jsx               # Página de inicio de sesión.
│   │   ├── MyBarterProposalsPage.jsx   # PÁGINA CLAVE PARA DEPURAR: Muestra las propuestas de trueque del usuario.
│   │   ├── MyOrdersPage.jsx            # Muestra los pedidos del usuario.
│   │   ├── NotificationsPage.jsx       # Notificaciones del usuario.
│   │   ├── OrderDetailsPage.jsx        # Detalles de un pedido específico.
│   │   ├── PaymentCancelPage.jsx       # Página de cancelación de pago.
│   │   ├── PaymentSuccessPage.jsx      # Página de éxito de pago.
│   │   ├── PremiumInventoryPage.jsx    # Inventario exclusivo para usuarios Premium.
│   │   ├── PremiumUpsellPage.jsx       # Página de promoción/mejora a Premium.
│   │   ├── ProductDetailsPage.jsx      # Detalles de un producto específico.
│   │   ├── ProductListPage.jsx         # Lista de todos los productos disponibles.
│   │   ├── RegisterPage.jsx            # Página de registro de nuevo usuario.
│   │   ├── RentalDetailsPage.jsx       # Detalles de una oferta de alquiler específica.
│   │   ├── RentalListPage.jsx          # Lista de todas las ofertas de alquiler.
│   │   ├── ServiceListPage.jsx         # Lista de todos los servicios disponibles.
│   │   ├── ServiceDetailsPage.jsx      # Detalles de un servicio específico.
│   │   └── WelcomePage.jsx             # Página de bienvenida.
│   ├── services/               # Módulos para interactuar con la API del backend.
│   │   └── api.js              # Instancia de Axios con interceptor para tokens de autenticación.
│   └── App.jsx, App.css, index.css, main.jsx # Archivos principales de la aplicación.
├── .env                        # Variables de entorno (ej. URL del backend).
├── .gitignore                  # Archivos y directorios a ignorar por Git.
├── eslint.config.js            # Configuración de ESLint.
├── index.html                  # Plantilla HTML principal.
├── package-lock.json, package.json # Definiciones de proyectos y dependencias de Node.js.
├── postcss.config.cjs          # Configuración de PostCSS.
├── README.md                   # Este archivo.
├── tailwind.config.js          # Configuración de Tailwind CSS.
└── vite.config.js              # Configuración de Vite.

🔑 Puntos Clave del Frontend
Autenticación:

Gestionada por AuthContext.jsx y useAuth.js.

El token de autenticación (CampoBit_token) se almacena en localStorage.

api.js (Axios) intercepta las solicitudes para adjuntar automáticamente el token en la cabecera Authorization: Bearer <token>.

PrivateRoute.jsx y PremiumRoute.jsx protegen las rutas según el estado de autenticación/premium del usuario.

Interacción con el Backend:

Todas las llamadas a la API se realizan a través de la instancia api de Axios configurada en src/services/api.js.

La URL base del backend se define en las variables de entorno (.env).

Gestión de Propuestas de Trueque (MyBarterProposalsPage.jsx):

Esta página es central para el problema actual.

Recupera las propuestas del endpoint /api/barter/myproposals.

Incluye lógica para verificar la presencia del token (authTokens?.access) y mostrar un error si falta.

Muestra BarterProposalCard para cada propuesta.

Estilos:

Utiliza Tailwind CSS para la estilización.
