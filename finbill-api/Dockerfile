FROM php:8.2-cli-alpine

# Install standard system hooks and PostgreSQL client tools
RUN apk add --no-cache bash postgresql-dev libpng-dev libzip-dev zip unzip

# Build standard PHP extensions database layers
RUN docker-php-ext-install pdo pdo_pgsql gd zip

# Download global Composer binaries
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Run standard optimization packages install steps
RUN composer install --no-dev --optimize-autoloader

# Expose production port matching Render environments variables
EXPOSE 10000

# Standalone start command triggering internal artisan serving loops straight
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
