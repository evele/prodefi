# Crear aplicación

Las **aplicaciones** son entidades registradas dentro de Mercado Pago que actúan como un identificador único para gestionar la autenticación y autorización de tus integraciones. Es decir, son el vínculo entre tu desarrollo y Mercado Pago, y constituyen la primera etapa para realizar la integración. 

Con ellas, es posible acceder a las :toolTipComponent[credenciales]{link="/developers/es/docs/credentials" linkText="Credenciales" content="Claves de acceso únicas con las que identificamos una integración en tu cuenta, vinculadas a tu aplicación. Para más información, accede al link a continuación."} necesarias para interactuar con nuestras APIs o servicios específicos, así como gestionar y organizar tu integración, por lo que deberás crear una aplicación por cada solución de Mercado Pago que integres.

Para crear una **aplicación**, sigue los pasos a continuación.

1. En la esquina superior derecha de Mercado Pago Developers, haz clic en **Ingresar** e ingresa los datos requeridos con la información correspondiente a tu cuenta de Mercado Pago.
2. Con la sesión iniciada, en la esquina superior derecha de Mercado Pago Developers, haz clic en **Crear aplicación** si tu cuenta aún no tiene ninguna aplicación creada, o accede a "Tus integraciones" y selecciona **Ver todas**. Allí, haz clic en **Crear aplicación**.
3. Una vez dentro de **Tus integraciones**, haz clic en el botón **Crear aplicación**.

> NOTE
>
> Para proteger tu cuenta, durante la creación de una aplicación será necesario que realices una verificación de identidad, en caso de que aún no la hayas realizado, o una reautenticación, si ya has completado previamente el proceso de verificación.

![create-application-1](/images/snippets/create-application-1-es-v1.png)

4. Ingresa un **nombre** para identificar tu aplicación. El límite es de hasta 50 caracteres alfanuméricos.
5. Selecciona **Pagos online** como el tipo de pago que quieres integrar, ya que es el tipo de solución correspondiente a tiendas virtuales. Haz clic **Continuar**.
6. Selecciona que estás integrando para una tienda hecha con desarrollo propio. Opcionalmente podrás completar la URL de tu tienda. Haz clic en **Continuar**.
7. Selecciona la opción **Checkouts** y luego selecciona **Checkout Pro** como la solución que vas a integrar.
8. Confirma las opciones seleccionadas. En caso de que necesites modificar alguna selección, puedes hacer clic en el botón **Editar**. Acepta la [Declaración de Privacidad](https://www.mercadopago[FAKER[URL][DOMAIN]/privacidad) y los [Términos y condiciones](/developers/es/docs/resources/legal/terms-and-conditions) y haz clic en **Confirmar**.

![Resumen de aplicación](/images/snippets/create-application/ES-new-app-CHO-PRO-v1.png)

En [Tus integraciones](/developers/panel/app) podrás consultar el listado de todas tus aplicaciones creadas y acceder a los [Datos de integración](/developers/es/docs/checkout-pro/resources/application-details) de cada una de ellas. 

> NOTE
>
> Si lo deseas, puedes editar o eliminar una aplicación. En este último caso, debes tener en cuenta que tu tienda perderá la capacidad de recibir pagos a través de la integración con Mercado Pago asociada a esa aplicación. Para más información, consulta los [Datos de integración](/developers/es/docs/checkout-pro/resources/application-details).

## Acceder a las credenciales de prueba

Después de crear tu aplicación, automáticamente también se crearán las :toolTipComponent[credenciales de prueba]{link="/developers/es/docs/checkout-pro/resources/credentials" linkText="Credenciales" content="Claves de acceso únicas con las que identificamos una integración en tu cuenta, vinculadas a tu aplicación. Para más información, accede al link a continuación."}. Utiliza las **credenciales de prueba** para realizar todas las configuraciones y validaciones necesarias en un entorno seguro de pruebas. 

Al acceder a las credenciales de prueba, se mostrarán los siguientes pares de credenciales: :toolTipComponent[Public Key]{content="Clave pública que es utilizada en el _frontend_ para acceder a información y cifrar datos. Puedes acceder a ella a través de *Tus integraciones > Detalles de aplicación > Pruebas > Credenciales de prueba*."} y el :toolTipComponent[Access Token]{content="Clave privada de la aplicación creada en Mercado Pago, que es utilizada en el _backend_. Puedes acceder a ella a través de *Tus integraciones > Detalles de aplicación > Pruebas > Credenciales de prueba*."} de prueba.

![credenciales de test](/images/snippets/credentials/app-data-test-credentials-es-v1.png) 

> NOTE
>
> Si estás utilizando una aplicación ya existente, será necesario activar las credenciales de prueba. Para más información, consulta la documentación de [Credenciales](/developers/es/docs/checkout-pro/additional-content/credentials).