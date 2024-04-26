FROM php:8.3-fpm

RUN apt-get update && apt-get install -y zlib1g-dev g++ git libicu-dev zip libzip-dev zip nano\
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && pecl install apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip


RUN pecl install xdebug \ && docker-php-ext-enable xdebug

COPY ./php/xdebug.ini "/usr/local/etc/php/conf.d"

WORKDIR /var/www/project

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
