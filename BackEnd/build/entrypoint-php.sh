#!/bin/bash
set -e

cd /var/www/html

HOST_UID=$(stat -c '%u' /var/www/html)
HOST_GID=$(stat -c '%g' /var/www/html)

if [ ! -f "vendor/autoload.php" ]; then
  composer install --no-interaction --optimize-autoloader
fi


if [ -d "vendor" ]; then
  chown -R "$HOST_UID:$HOST_GID" /var/www/html/vendor
fi

exec apache2-foreground
