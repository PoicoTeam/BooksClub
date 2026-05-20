#!/bin/bash
set -e

cd /var/www/html


if [ ! -d "vendor" ]; then
  composer install --no-interaction --optimize-autoloader
fi


chown -R www-data:www-data /var/www/html

exec apache2-foreground
