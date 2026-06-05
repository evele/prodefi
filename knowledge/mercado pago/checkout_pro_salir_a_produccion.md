# Salir a producción

Una vez finalizado el proceso de configuración y pruebas, tu integración estará lista para recibir pagos reales en producción.

A continuación, mira las recomendaciones necesarias para realizar este pasaje de manera eficaz y segura, garantizando que tu integración esté preparada para recibir transacciones reales.

:::AccordionComponent{title="Activar credenciales de producción" pill="1"}
Después de realizar las debidas [pruebas de tu integración](/developers/es/docs/checkout-api-payments/integration-test), **recuerda reemplazar las :toolTipComponent[credenciales]{link="/developers/es/docs/checkout-api-payments/resources/credentials" linkText="Credenciales" content="Claves de acceso únicas con las que identificamos una integración en tu cuenta, vinculadas a tu aplicación. Para más información, accede al link a continuación."} que utilizaste en la etapa de desarrollo por las de producción** para que puedas comenzar a operar en el entorno productivo de tu tienda y empezar a recibir pagos reales. Para ello, sigue los pasos a continuación para saber cómo **activarlas**.

1. Ingresa a [Tus integraciones](https://www.mercadopago[FAKER][URL][DOMAIN]/developers/panel/app) y selecciona una aplicación. 
2. En la sección **Datos de integración**, dirígete a la sección **Credenciales** ubicado a la derecha de la pantalla y haz clic en **Productivas**. Haz clic en **Activar credenciales**. Alternativamente, puedes dirigirte a la sección **Credenciales de producción** en el menú lateral izquierdo.
3. En el campo **Industria**, selecciona del menú desplegable la industria o rubro a la que pertenece el negocio que estás integrando. 
4. En el campo **Sitio web (obligatorio)**, completa con la URL del sitio web de tu negocio.
5. Acepta la [Declaración de Privacidad](https://www.mercadopago[FAKER[URL][DOMAIN]/privacidad) y los [Términos y condiciones](/developers/es/docs/resources/legal/terms-and-conditions). Completa el reCAPTCHA y haz clic en **Activar credenciales de producción**.
:::

:::AccordionComponent{title="Usar credenciales de producción" pill="2"}
Para salir a producción, deberás **colocar las credenciales de producción de tu aplicación de Mercado Pago** en tu integración.

Para hacerlo, ingresa a [Tus integraciones](/developers/panel/app), dirígete a la sección **Credenciales** ubicado a la derecha de la pantalla y haz clic en **Productivas**. Alternativamente, puedes acceder a **Producción > Credenciales de producción**. 

Allí encontrarás tu **Public Key** y **Access Token** productivos, que deberás utilizar en lugar de los de la cuenta de prueba.

![Cómo acceder a las credenciales a través de Tus Integraciones](/images/snippets/credentials/app-data-production-credentials-es-v1.png)

Para más información, consulta nuestra documentación de [Credenciales](/developers/es/docs/checkout-pro/additional-content/credentials).
:::

:::AccordionComponent{title="Implementar certificado SSL" pill="3"}
Para garantizar una integración segura que proteja los datos de cada transacción, es necesario implementar un certificado SSL (Secure Sockets Layer). Este certificado, junto con la utilización del protocolo HTTPS en la disponibilización de los medios de pago, asegura una conexión encriptada entre el cliente y el servidor.

Adoptar estas medidas no solo refuerza la seguridad de los datos de los usuarios, sino que también asegura el cumplimiento de las normativas y leyes específicas de cada país relacionadas con la protección de datos y la seguridad de la información. Además, contribuye significativamente a proporcionar una experiencia de compra más segura y confiable.

Aunque **la exigencia del certificado SSL no aplique durante el período de pruebas**, su implementación es obligatoria para entrar en producción.

Para más información, conoce los [Términos y Condiciones de Mercado Pago](/developers/es/docs/resources/legal/terms-and-conditions).
:::

:::AccordionComponent{title="Medir la calidad de tu integración" pill="Opcional"}
Una vez que hayas terminado de configurar tu integración, recomendamos que realices una **medición de calidad**, que es un proceso de certificación de tu integración, con el que podrás asegurar que tu desarrollo cuente con los requisitos de calidad necesarios para asegurar una mejor experiencia, así como una mayor tasa de aprobación de pagos. 

Para conocer más, ve a la documentación [Cómo medir la calidad de tu integración](/developers/es/docs/checkout-pro/how-tos/integration-quality).
:::