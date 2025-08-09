# Ejemplos de uso del Bot Finanzas Libre

## Comandos básicos

### Iniciar el bot
```
/start
```

### Obtener ayuda
```
/help
```

### Verificar información
```
/info
```

### Verificar estado
```
/ping
```

## Análisis de movimientos financieros

### Usando el comando /analizar
```
/analizar Compré café en Starbucks por $5.50
/analizar Recibí mi salario de $2000
/analizar Pagué la factura de luz $85
/analizar Vendí un producto por $150
/analizar Gasté $30 en el supermercado
```

### Análisis automático (solo escribir la descripción)
```
Compré café en Starbucks por $5.50
Recibí mi salario de $2000
Pagué la factura de luz $85
Vendí un producto por $150
Gasté $30 en el supermercado
Cena en restaurante $45
Uber al trabajo $12
Cobré por servicios de consultoría $800
Compré ropa nueva $120
Pago mensual del gym $50
```

## Respuestas esperadas

Cada análisis incluirá:
- **Tipo:** INGRESO o EGRESO
- **Categoría:** Categoría principal donde clasificar
- **Subcategoría:** Clasificación más específica
- **Explicación:** Breve análisis del movimiento
- **Confianza:** Nivel de certeza del análisis

## Ejemplos de categorización

### INGRESOS
- "Recibí mi salario de $2000" → Salario y Remuneraciones
- "Vendí un producto por $150" → Negocios y Emprendimiento
- "Dividendos de acciones $50" → Inversiones y Rentabilidad

### EGRESOS
- "Compré café por $5" → Alimentación y Bebidas
- "Uber al trabajo $12" → Transporte y Combustible
- "Factura de luz $85" → Vivienda y Servicios
- "Cena en restaurante $45" → Entretenimiento y Ocio
- "Compré ropa nueva $120" → Ropa y Accesorios
