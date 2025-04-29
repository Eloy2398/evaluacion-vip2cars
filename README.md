## Instalación y configuración

1. **Levantar los contenedores con Docker Compose**:

    Primero, asegúrate de tener Docker y Docker Compose instalados. Luego, desde la raíz del proyecto, ejecuta:

   ```bash
   docker-compose up --build

2. **Ejecutar las migraciones de la base de datos**:
    Una vez que los contenedores estén en ejecución, debes ejecutar las migraciones para crear las tablas de la base de datos. Para hacerlo, abre una terminal y accede al contenedor de Laravel:

    ```bash
    docker-compose exec servidor bash
    php artisan migrate --force
