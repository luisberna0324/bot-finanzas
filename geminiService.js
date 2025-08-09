const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async analyzeMovement(movementDescription) {
    try {
      const prompt = `
Eres un experto en análisis financiero personal. Analiza el siguiente movimiento financiero y proporciona:

1. TIPO DE MOVIMIENTO: Clasifica como "INGRESO" o "EGRESO"
2. CATEGORÍA: Asigna una categoría específica
3. SUBCATEGORÍA: Una subcategoría más detallada
4. EXPLICACIÓN: Breve explicación del análisis

CATEGORÍAS DISPONIBLES:

INGRESOS:
- Salario y Remuneraciones
- Negocios y Emprendimiento
- Inversiones y Rentabilidad
- Prestamos Recibidos
- Otros Ingresos

EGRESOS:
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

TEXTO A ANALIZAR: "${movementDescription}"

Responde SOLO en el siguiente formato JSON:
{
  "tipo": "INGRESO/EGRESO",
  "categoria": "categoria_principal",
  "subcategoria": "subcategoria_detallada",
  "explicacion": "breve_explicacion_del_analisis",
  "confianza": "alta/media/baja"
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Intentar parsear la respuesta JSON
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          return analysis;
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
      }
      
      // Fallback si no se puede parsear el JSON
      return {
        tipo: "EGRESO",
        categoria: "Otros Gastos",
        subcategoria: "Sin clasificar",
        explicacion: "No se pudo analizar automáticamente",
        confianza: "baja"
      };
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Error al analizar el movimiento financiero');
    }
  }

  async validateApiKey() {
    try {
      const result = await this.model.generateContent('Hola, ¿puedes responder "OK" si me entiendes?');
      const response = await result.response;
      return response.text().includes('OK') || response.text().includes('ok');
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
}

module.exports = GeminiService;
