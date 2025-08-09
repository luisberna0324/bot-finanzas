# Finanzas Libre Bot con IA

Bot de Telegram con inteligencia artificial para análisis de movimientos financieros utilizando Google Gemini Pro.

## 🚀 Configuración

### 1. Crear un bot en Telegram

1. Abre Telegram y busca `@BotFather`
2. Envía `/newbot` para crear un nuevo bot
3. Sigue las instrucciones para elegir un nombre y username
4. Guarda el token que te proporciona BotFather

### 2. Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API Key
3. Guarda la API Key de forma segura

### 3. Configurar el proyecto

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno en el archivo `.env`:
```env
BOT_TOKEN=tu_token_de_telegram
GEMINI_API_KEY=tu_api_key_de_gemini
```

3. Ejecuta el bot:
```bash
npm start
```

Para desarrollo con reinicio automático:
```bash
npm run dev
```

## 📋 Comandos disponibles

- `/start` - Mensaje de bienvenida
- `/help` - Mostrar ayuda completa
- `/info` - Información del bot y usuario
- `/ping` - Verificar estado del bot
- `/analizar [descripción]` - Analizar un movimiento financiero específico

## 🧠 Análisis Automático con IA

El bot analiza automáticamente cualquier mensaje que parezca ser una descripción de movimiento financiero:

### Ejemplos de uso:
- "Compré café en Starbucks por $5.50"
- "Recibí mi salario de $2000"
- "Pagué la factura de luz $85"
- "Vendí un producto por $150"
- "Gasté $30 en el supermercado"

### El bot responde con:
- **Tipo de movimiento:** INGRESO o EGRESO
- **Categoría principal:** Categoría donde se debe registrar
- **Subcategoría:** Clasificación más específica
- **Explicación:** Análisis del movimiento
- **Nivel de confianza:** Qué tan seguro está el análisis

## 📊 Categorías disponibles

### INGRESOS:
- Salario y Remuneraciones
- Negocios y Emprendimiento
- Inversiones y Rentabilidad
- Prestamos Recibidos
- Otros Ingresos

### EGRESOS:
- Alimentación y Bebidas
- Transporte y Combustible
- Vivienda y Servicios
- Salud y Medicina
- Educación y Capacitación
- Entretenimiento y Ocio
- Ropa y Accesorios
- Tecnología y Electrónicos
- Prestamos y Deudas
- Ahorro e Inversiones
- Otros Gastos

## 🎯 Funcionalidades

- ✅ Análisis automático de movimientos financieros
- ✅ Clasificación inteligente por tipo y categoría
- ✅ Detección automática de descripciones financieras
- ✅ Respuestas personalizadas con emojis
- ✅ Comandos básicos de información
- ✅ Manejo de errores robusto
- ✅ Validación de conexión con APIs

## 🛠️ Tecnologías utilizadas

- **Node.js** - Runtime de JavaScript
- **node-telegram-bot-api** - Librería para interactuar con Telegram
- **@google/generative-ai** - Cliente oficial de Google Gemini
- **dotenv** - Para manejar variables de entorno
- **nodemon** - Para desarrollo con reinicio automático

## 📝 Estructura del proyecto

```
bot/
├── index.js              # Archivo principal del bot
├── geminiService.js      # Servicio para interactuar con Gemini
├── package.json          # Dependencias y scripts
├── .env                  # Variables de entorno (tokens y APIs)
├── .gitignore           # Archivos a ignorar en git
└── README.md            # Esta documentación
```

## 🔧 Desarrollo

### Agregar nuevas categorías
Puedes modificar las categorías disponibles en el archivo `geminiService.js` en la sección del prompt.

### Personalizar respuestas
Las respuestas del bot se pueden personalizar en el archivo `index.js` en las diferentes funciones de manejo de comandos.

### Mejorar el análisis
El prompt de Gemini se puede ajustar para obtener análisis más precisos según tus necesidades específicas.

## 🚨 Solución de problemas

### Error: BOT_TOKEN no está definido
- Verifica que el archivo `.env` existe
- Asegúrate de que el token está correctamente configurado
- No incluyas espacios antes o después del token

### Error: GEMINI_API_KEY no está definido
- Verifica que tienes una API Key válida de Google AI Studio
- Asegúrate de que la API Key está configurada en el archivo `.env`
- Verifica que la API Key no ha expirado

### El bot no responde
- Verifica que el bot esté ejecutándose sin errores
- Revisa los logs en la consola
- Verifica la conexión a internet

## 📄 Licencia

MIT
