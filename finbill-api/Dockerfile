FROM php:8.2-cli-alpine

# Install required packages
RUN apk add --no-cache \
    bash \
    git \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    gd \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose Render port
EXPOSE 10000

# Start application
CMD sh -c "\
php artisan optimize:clear && \
php artisan migrate --force && \
php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"