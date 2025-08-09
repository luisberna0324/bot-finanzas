require('dotenv').config();

// Polyfill para fetch en versiones de Node.js que no lo incluyen
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

const TelegramBot = require('node-telegram-bot-api');
const GeminiService = require('./geminiService');

// Tokens y configuración
const token = process.env.BOT_TOKEN;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!token) {
  console.error('❌ Error: BOT_TOKEN no está definido en el archivo .env');
  process.exit(1);
}

if (!geminiApiKey) {
  console.error('❌ Error: GEMINI_API_KEY no está definido en el archivo .env');
  process.exit(1);
}

// Crear instancias
const bot = new TelegramBot(token, { polling: true });
const geminiService = new GeminiService();

console.log('🤖 Bot de Telegram iniciado correctamente');

// Validar conexión con Gemini al iniciar
(async () => {
  try {
    const isValid = await geminiService.validateApiKey();
    if (isValid) {
      console.log('✅ Conexión con Gemini API establecida correctamente');
    } else {
      console.log('⚠️  Advertencia: No se pudo validar la conexión con Gemini API');
    }
  } catch (error) {
    console.log('⚠️  Advertencia: Error al validar Gemini API:', error.message);
  }
})();

// Base de API del frontend (para endpoints Next.js)
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9002';

// Helper para construir display name
function buildDisplayName(from) {
  const parts = [from.first_name, from.last_name].filter(Boolean);
  return parts.length ? parts.join(' ') : (from.username ? `@${from.username}` : 'Usuario');
}

// Comando /start con flujo de alta y validación de existencia
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const displayName = buildDisplayName(msg.from);
  const telegramId = String(msg.from.id);

  try {
    const res = await fetch(`${API_BASE_URL}/api/bot/users/exists?telegramId=${telegramId}`);
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.exists) {
      // Usuario ya existe
      const message = `¡Hola ${displayName}! 👋\n\nYa estás dado de alta en Finanzas Libre.`;
      await bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [[
            { text: '🔐 Obtener enlace de acceso', callback_data: 'login_link' }
          ]]
        }
      });
      return;
    }
  } catch {}

  const welcomeMessage = `¡Hola ${displayName}! 👋\n\nSoy el bot de Finanzas Libre. ¿Deseas darte de alta en el sistema para usar la app web?`;

  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Sí, darme de alta', callback_data: 'register_yes' },
          { text: '❌ No, gracias', callback_data: 'register_no' },
        ],
      ],
    },
  });
});

// Comando /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `📋 Comandos disponibles:

/start - Mensaje de bienvenida
/help - Mostrar esta ayuda
/info - Información del bot
/ping - Verificar estado del bot
/analizar [descripción] - Analizar un movimiento financiero

💡 **Análisis de movimientos financieros:**
Puedes enviar cualquier descripción de un movimiento financiero y la IA lo analizará.

Ejemplos:
• "Compré café en Starbucks por $5.50"
• "Recibí mi salario de $2000"
• "Pagué la factura de luz $85"
• "Vendí un producto por $150"

El bot te dirá si es ingreso o egreso y la categoría correspondiente.`;

  bot.sendMessage(chatId, helpMessage);
});

// Manejo de alta (inline keyboard)
bot.on('callback_query', async (query) => {
  try {
    const data = query.data;
    const chatId = query.message.chat.id;
    const from = query.from;

    if (data === 'register_no') {
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, 'Sin problema. Cuando quieras, usa /start para comenzar.');
      return;
    }

    if (data === 'register_yes' || data === 'login_link') {
      await bot.answerCallbackQuery(query.id, { text: 'Procesando tu alta…' });

      const telegramId = String(from.id);
      const username = from.username ? `@${from.username}` : '';
      const displayName = buildDisplayName(from);

      // Crear/actualizar usuario y generar URL de login temporal
      const res = await fetch(`${API_BASE_URL}/api/auth/telegram/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, username, displayName }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        await bot.sendMessage(chatId, `❌ No fue posible completar el alta: ${err.error || 'error'} `);
        return;
      }

      const data = await res.json();
      const loginUrl = data.loginUrl;
      console.log(loginUrl);
      const expiresAt = data.expiresAt ? new Date(data.expiresAt).toLocaleString('es-ES') : null;

      const text = `✅ ¡Listo, ${displayName}!\n\nTu cuenta ha sido creada/actualizada y ya puedes acceder a la app web.${expiresAt ? `\n\n⏰ Este enlace expira: ${expiresAt}` : ''}`;

      await bot.sendMessage(chatId, text, {
        reply_markup: {
          inline_keyboard: [[
            { text: '🔑 Abrir acceso', url: loginUrl }
          ]]
        }
      });
      return;
    }
  } catch (error) {
    console.error('Error en callback_query:', error);
    if (query && query.id) {
      try { await bot.answerCallbackQuery(query.id); } catch {}
    }
    try {
      await bot.sendMessage(query.message.chat.id, '❌ Ocurrió un error procesando tu solicitud.');
    } catch {}
  }
});

// Comando /info
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  
  const infoMessage = `ℹ️ Información del bot:

🤖 Nombre: Finanzas Libre Bot con IA
📍 Versión: 1.0.0
🎯 Propósito: Análisis de movimientos financieros con IA
🧠 IA: Google Gemini Pro
⚡ Estado: Activo

👤 Usuario: ${msg.from.first_name || 'Desconocido'}
🆔 Chat ID: ${chatId}
📅 Fecha: ${new Date().toLocaleDateString('es-ES')}
🕐 Hora: ${new Date().toLocaleTimeString('es-ES')}`;

  bot.sendMessage(chatId, infoMessage);
});

// Comando /ping
bot.onText(/\/ping/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🏓 Pong! El bot está funcionando correctamente.');
});

// Comando /analizar
bot.onText(/\/analizar(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const movementText = match[1] ? match[1].trim() : '';
  
  if (!movementText) {
    bot.sendMessage(chatId, `❌ Por favor, proporciona una descripción del movimiento.

Ejemplo: /analizar Compré café en Starbucks por $5.50`);
    return;
  }
  
  try {
    // Mostrar mensaje de "procesando"
    bot.sendMessage(chatId, '🤖 Analizando movimiento financiero...');
    
    // Analizar con Gemini
    const analysis = await geminiService.analyzeMovement(movementText);
    
    // Formatear respuesta
    const responseMessage = `📊 **Análisis del movimiento:**

💬 **Descripción:** ${movementText}

📈 **Tipo:** ${analysis.tipo}
📂 **Categoría:** ${analysis.categoria}
🏷️ **Subcategoría:** ${analysis.subcategoria}
📝 **Explicación:** ${analysis.explicacion}
🎯 **Confianza:** ${analysis.confianza}

${analysis.tipo === 'INGRESO' ? '💰' : '💸'} Este movimiento se registraría como **${analysis.tipo.toLowerCase()}** en la categoría **${analysis.categoria}**.`;
    
    bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error analyzing movement:', error);
    bot.sendMessage(chatId, '❌ Error al analizar el movimiento. Por favor, intenta nuevamente.');
  }
});

// Responder a mensajes de texto normales
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // Ignorar comandos (que empiecen con /)
  if (messageText && !messageText.startsWith('/')) {
    try {
      // Verificar si el mensaje parece ser una descripción financiera
      const isFinancialDescription = /(\$|€|£|pesos?|dólares?|euros?|compré|compre|pagué|pague|recibí|recibí|vendí|vendi|gasté|gaste|ingres|egres|factura|salario|sueldo|compr|vend|pag|recib|gast)/i.test(messageText);
      
      if (isFinancialDescription || messageText.length > 10) {
        // Mostrar mensaje de "procesando"
        bot.sendMessage(chatId, '🤖 Analizando tu movimiento financiero...');
        
        // Analizar con Gemini
        const analysis = await geminiService.analyzeMovement(messageText);
        
        // Formatear respuesta
        const responseMessage = `📊 **Análisis automático:**

💬 **Tu mensaje:** ${messageText}

📈 **Tipo:** ${analysis.tipo}
📂 **Categoría:** ${analysis.categoria}
🏷️ **Subcategoría:** ${analysis.subcategoria}
📝 **Explicación:** ${analysis.explicacion}
🎯 **Confianza:** ${analysis.confianza}

${analysis.tipo === 'INGRESO' ? '💰' : '💸'} Este movimiento se registraría como **${analysis.tipo.toLowerCase()}** en la categoría **${analysis.categoria}**.

💡 *Si no es un movimiento financiero, escribe /help para ver otros comandos.*`;
        
        bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' });
        
      } else {
        // Respuesta normal para mensajes cortos o no financieros
        const responses = [
          `Has escrito: "${messageText}" 📝\n\n💡 Si quieres analizar un movimiento financiero, describe la transacción (ej: "Compré café por $5")`,
          `Recibido tu mensaje: "${messageText}" ✅\n\n� Puedo analizar movimientos financieros automáticamente.`,
          `Mensaje procesado: "${messageText}" 🔄\n\n💡 Escribe algo como "Pagué la factura de luz $85" para análisis automático.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        bot.sendMessage(chatId, randomResponse);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      bot.sendMessage(chatId, '❌ Error al procesar tu mensaje. Por favor, intenta nuevamente.');
    }
  }
});

// Manejar errores
bot.on('error', (error) => {
  console.error('❌ Error del bot:', error);
});

// Manejar interrupciones del proceso
process.on('SIGINT', () => {
  console.log('\n🛑 Bot detenido por el usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Bot detenido');
  process.exit(0);
});
