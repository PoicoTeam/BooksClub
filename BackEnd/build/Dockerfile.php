FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    libssl-dev \
    unzip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install mysqli && a2enmod rewrite headers

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY ./build/entrypoint-php.sh /entrypoint-php.sh
RUN chmod +x /entrypoint-php.sh

WORKDIR /var/www/html

EXPOSE 80

ENTRYPOINT ["/entrypoint-php.sh"]
