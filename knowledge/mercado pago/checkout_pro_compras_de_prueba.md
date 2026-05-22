# Realizar compras de prueba

Después de configurar su ambiente de pruebas, podrás realizar compras de prueba para validar la integración con el Checkout Pro y comprobar que los medios de pago configurados funcionen correctamente. A continuación, te mostraremos cómo realizar diferentes comprobaciones en tu integración.

> RED_MESSAGE
>
> Realiza las compras de prueba en una **pestaña de incógnito** de tu navegador para evitar errores por duplicidad de credenciales en el proceso.

## Probar una compra con tarjeta

Para probar una compra con tarjeta de crédito o débito, sigue el paso a paso:

1. Accede a [Mercado Pago Developers](/developers/es/docs) e inicia sesión como un **usuario de prueba de comprador** que creaste previamente. Para eso, utiliza el usuario y la contraseña asignados al mismo. Puedes consultar estos datos en la documentación [Prueba de integración > Crear cuenta de prueba comprador](/developers/es/docs/checkout-pro/integration-test).

> NOTE
>
> Si se solicita un código por e-mail al iniciar sesión, ingresa el **código de 6 dígitos** asociado a tu cuenta de prueba, que puedes encontrar en **[Tus integraciones](/developers/panel/app) > *Tu aplicación* > Cuentas de prueba**.

2. Inicializa el Checkout desde la preferencia de pago que creaste. Puedes encontrar las instrucciones de cómo inicializarlo en la documentación [Agregar el SDK al frontend e inicializar el checkout](/developers/es/docs/checkout-pro/web-integration/add-frontend-sdk).
3. **En un navegador de incógnito**, accede a la tienda en donde integraste Checkout Pro, selecciona algún producto o servicio y, en la instancia de pago, haz clic en el botón de compra de Mercado Pago.
4. Finalmente, realiza una compra de prueba utilizando los datos de **tarjetas de prueba** que se muestran a continuación. Ten en cuenta que puedes **simular diferentes resultados de compra** utilizando distintos nombres de titular en las tarjetas de pruebas.

### Tarjetas de prueba
Mercado Pago proporciona **tarjetas de prueba** que te permitirán probar pagos sin utilizar una tarjeta real. 

Sus datos, como número, código de seguridad y fecha de caducidad, pueden ser combinados con los datos relativos al **titular de la tarjeta**, que te permitirán probar distintos escenarios de pago. Es decir, **puedes utilizar la información de cualquier tarjeta de prueba y probar resultados de pago diferentes a partir de los datos del titular**. 

A continuación, puedes ver los datos de las **tarjetas de débito y crédito de prueba**. Selecciona aquella que quieras utilizar para probar tu integración.

| Tipo de tarjeta | Bandera | Número | Código de seguridad | Fecha de caducidad |
| :--- | :---: | :---: | :---: | :---: |
| Tarjeta de crédito | Mastercard | 5031 7557 3453 0604 | 123 | 11/30 |
| Tarjeta de crédito | Visa | 4509 9535 6623 3704 | 123 | 11/30 |
| Tarjeta de crédito | American Express | 3711 803032 57522 | 1234 | 11/30 |
| Tarjeta de débito | Mastercard | 5287 3383 1025 3304 | 123 | 11/30 |
| Tarjeta de débito | Visa | 4002 7686 9439 5619 | 123 | 11/30 |

Luego, elige qué escenario de pago probar, y completa los campos del **titular de la tarjeta** (Nombre y apellido, Tipo y número de documento) según lo indica la tabla a continuación.

| Estado de pago | Nombre y apellido del titular | Documento de identidad |
| --- | --- | --- |
| Pago aprobado | `APRO` | (DNI) 12345678 |
| Rechazado por error general | `OTHE` | (DNI) 12345678 |
| Pendiente de pago | `CONT` | - | 
| Rechazado con validación para autorizar | `CALL` | - |
| Rechazado por importe insuficiente | `FUND` | - |
| Rechazado por código de seguridad inválido | `SECU` | - |
| Rechazado debido a un problema de fecha de vencimiento | `EXPI` | - |
| Rechazado debido a un error de formulario | `FORM` | - |
| Rechazado por falta de card_number | `CARD` | - |
| Rechazado por cuotas invalidas | `INST` | - |
| Rechazado por pago duplicado | `DUPL` | - |
| Rechazado por tarjeta deshabilitada | `LOCK` | - |
| Rechazado por tipo de tarjeta no permitida | `CTNA` | - |
| Rechazado debido a intentos excedidos del pin de la tarjeta | `ATTE` | - |
| Rechazado por estar en lista negra | `BLAC` | - |
| No soportado | `UNSU` | - |
| Usado para aplicar regla de montos | `TEST` | - |

Una vez que hayas completado todos los campos correctamente, haz clic en el botón para procesar el pago, y aguarda el resultado. Si la prueba fue exitosa, verás la pantalla de éxito de la compra de prueba.

Si has configurado [notificaciones](/developers/es/docs/checkout-pro/payment-notifications), verifica que estás recibiendo las notificaciones correspondientes a la transacción de prueba.

## Probar una compra con un medio de pago offline

Puedes verificar si tu integración procesa correctamente medios de pago offline, tales como Rapipago y Pago Fácil. Ten en cuenta que una prueba exitosa será aquella que termine en un estado de pago pendiente, ya que las compras con medios de pago offline finalizan cuando el cliente completa el pago por otro medio.

Para realizar una prueba, sigue el paso a paso a continuación.

1. Accede a [Mercado Pago Developers](/developers/es/docs) e inicia sesión como una **cuenta de prueba de comprador**. Para eso, utiliza el usuario y la contraseña asignados a la misma. Puedes consultar estos datos en la documentación [Prueba de integración > Obtener una cuenta de prueba comprador](/developers/es/docs/checkout-pro/integration-test).

> NOTE
>
> Si se solicita un código por e-mail al iniciar sesión, ingresa los **últimos 6 dígitos del User ID de la cuenta de prueba**, que puedes encontrar en **[Tus integraciones](/developers/panel/app) > *Tu aplicación* > Cuentas de prueba**.

2. Inicializa el Checkout desde la preferencia de pago que creaste. Puedes encontrar las instrucciones de cómo inicializarlo en la documentación [Agregar el SDK al frontend e inicializar el checkout](/developers/es/docs/checkout-pro/web-integration/add-frontend-sdk).
3. **En un navegador de incógnito**, accede a la tienda que tiene integrado tu checkout, selecciona algún producto o servicio y, en la instancia de pago, haz clic en el botón de compra de Mercado Pago.
4. Selecciona un medio de pago offline y completa el pago.

Si la prueba es exitosa, verás una pantalla indicándote cómo completar el pago.