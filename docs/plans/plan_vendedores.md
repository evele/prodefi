# Plan Simple para Vendedores de Cartones

## Objetivo

Habilitar la venta offchain de cartones mediante vendedores de confianza, sin cambiar el modelo base del producto ni agregar complejidad innecesaria en esta etapa.

La idea es que:

1. El admin mintee cartones en batch.
2. El admin transfiera esos cartones a vendedores de confianza.
3. El vendedor cobre offchain al comprador final.
4. El vendedor transfiera el cartón al comprador final onchain.
5. El pozo se cargue aparte, manualmente, cuando corresponda.

## Decisiones Tomadas

### 1. No crear otro tipo de cartón

Se mantiene un único tipo de cartón. No se crearán cartones especiales para vendedores.

Motivos:

1. No resuelve el problema principal, que es la rendición de fondos.
2. Complica contratos, frontend y testing sin aportar valor inmediato.
3. El flujo actual ya permite mint y transferencias entre cuentas.

### 2. El vendedor no tendrá permiso de mint

El `MINTER_ROLE` queda fuera del vendedor.

Motivos:

1. Reduce superficie de riesgo.
2. Mantiene el control de emisión en el admin.
3. Evita que el vendedor pueda crear inventario por su cuenta.

### 3. La confianza en el vendedor es operativa

El diseño asume que los vendedores son de confianza.

Eso implica aceptar que:

1. Puede haber cartones entregados antes de que el dinero haya sido cargado al pozo.
2. No se busca, en esta etapa, enforcement fuerte onchain entre venta y depósito.
3. La rendición del vendedor es un proceso operativo, no una garantía criptográfica.

### 4. El pozo refleja solo fondos realmente depositados

El pozo no debe reflejar ventas estimadas ni cartones distribuidos. Solo debe reflejar el dinero efectivamente cargado en `Treasury`.

Principio:

1. El pozo refleja lo que hay en el pozo, ni más ni menos.

### 5. La carga del pozo la hará el admin

En esta etapa, quien probablemente cargue el pozo será el admin, no el vendedor.

Motivos:

1. Simplifica la operatoria.
2. Evita repartir responsabilidades onchain innecesariamente.
3. Permite consolidar ventas offchain y luego fondear el pozo con el asset elegido.

### 6. Assets preferidos para el pozo

La dirección preferida es trabajar principalmente con `USDC` o `USDT`, y eventualmente evaluar `sDAI` u otro activo más adelante.

No se define todavía una implementación especial para eso. Solo queda asentado como dirección de producto.

## Flujo Operativo Propuesto

### Flujo base

1. El admin mintea un lote de cartones.
2. El admin transfiere parte de ese lote a uno o más vendedores.
3. El vendedor vende offchain a precio oficial.
4. El vendedor transfiere cada cartón al comprador final.
5. El comprador final queda como holder onchain del cartón.
6. Más adelante, el admin carga el dinero correspondiente al pozo en `Treasury`.

### Estado funcional del cartón en esta etapa

1. Un cartón puede existir y circular sin que su dinero haya sido asociado individualmente al pozo.
2. Un usuario puede recibir ese cartón y usarlo normalmente.
3. No habrá, por ahora, activación por token ni bloqueo de predicción por falta de fondeo individual.

## Regla Operativa Crítica

Antes de cerrar un torneo, el admin debe haber cargado al pozo todo lo que quiera incluir en el snapshot final.

Motivo:

1. `Treasury.finalizeTournament(tournamentId)` congela el prize pool del torneo para todos los assets configurados.
2. Si el torneo se cierra con menos fondos de los esperados, ese faltante ya no entra en la foto final del premio.

Regla concreta:

1. Primero se fondea el pozo real.
2. Luego se cierra el torneo.
3. Nunca al revés.

## Qué No Se Va a Hacer en Esta Etapa

1. No crear un segundo tipo de cartón.
2. No dar `MINTER_ROLE` al vendedor.
3. No registrar onchain qué vendedor originó cada cartón.
4. No modelar comisión del vendedor onchain.
5. No exigir activación individual por token.
6. No bloquear predicciones según depósito individual.
7. No construir auditoría onchain detallada por vendedor.
8. No imponer lógica basada en días o ventanas temporales para rendición.

## Riesgos Aceptados

Este plan acepta explícitamente los siguientes riesgos:

1. Puede existir descalce temporal entre cartones vendidos y fondos efectivamente depositados.
2. La rendición del vendedor depende de la confianza operativa y del control manual del admin.
3. Si se cierra el torneo antes de fondear correctamente el pozo, el premio final quedará subfondeado.

Estos riesgos son aceptables en esta etapa porque la prioridad es simplificar la venta.

## Extensión Futura Posible

No se implementará ahora, pero queda identificada la evolución natural del diseño:

### Activación por token

En una etapa futura podría agregarse una capa de activación individual por `tokenId`.

Idea:

1. El cartón puede existir y transferirse.
2. Pero solo puede predecir cuando fue activado.
3. La activación podría hacerse de forma individual o por lista de tokens.
4. Opcionalmente, la activación podría estar ligada a un depósito en `Treasury`.

Eso serviría para resolver mejor el escenario donde el vendedor entrega cartones antes de que el dinero haya sido rendido.

## Impacto Técnico Esperado Cuando Se Implemente

La implementación futura simple de este plan debería requerir cambios relativamente acotados:

### Contratos

1. No debería requerir cambios estructurales grandes en `Carton` para soportar el flujo base, porque el contrato ya permite mint y transferencias.
2. `Treasury` ya soporta depósitos manuales para cuentas autorizadas.
3. El foco estará más en la operatoria y eventualmente en permisos o tooling administrativo.

### Frontend

1. Eventualmente podría agregarse tooling administrativo para preparar lotes y transferir inventario a vendedores.
2. No hace falta exponer al usuario final información sobre el vendedor de origen.
3. El usuario final solo necesita recibir su cartón y operar normalmente.

## Orden Recomendado de Trabajo Futuro

Cuando llegue el momento de implementarlo, el orden recomendado es:

1. Validar el flujo operativo exacto de distribución con vendedores.
2. Definir cómo se harán las transferencias a compradores finales, especialmente si se usa smart account asociada a email.
3. Agregar tooling administrativo mínimo para mint batch y distribución.
4. Definir la operatoria de carga manual del pozo.
5. Documentar la regla de no cerrar torneo antes de fondear completamente.
6. Recién después evaluar si hace falta activación por token.

## Resumen Final

El plan simple es:

1. Un solo cartón.
2. Mint centralizado por admin.
3. Distribución a vendedores de confianza.
4. Venta offchain y transferencia onchain al comprador.
5. Pozo cargado manualmente y por separado.
6. Sin trazabilidad fina por vendedor.
7. Sin activación por token en esta etapa.
8. Con disciplina operativa estricta antes del cierre del torneo.
