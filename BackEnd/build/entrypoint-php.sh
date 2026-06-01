#!/bin/bash
set -e

cd /var/www/html

HOST_UID=$(stat -c '%u' /var/www/html)
HOST_GID=$(stat -c '%g' /var/www/html)

if [ ! -f "vendor/autoload.php" ]; then
  echo "Vendor non trovato, avvio composer install..."
  composer install --no-interaction --optimize-autoloader
fi

if [ -d "vendor" ]; then
  chown -R "$HOST_UID:$HOST_GID" /var/www/html/vendor
fi

# --- SEED ADMIN PREDEFINITO ---
echo "In attesa di MongoDB e seed admin..."

# Disattiviamo temporaneamente l'uscita immediata per evitare il crash (codice 255)
set +e

for i in $(seq 1 30); do
  php seed/seed_default_admin.php
  STATUS=$?
  
  if [ $STATUS -eq 0 ]; then
    echo "Seed completato con successo o utente già esistente!"
    break
  fi
  
  echo "Tentativo $i/30 fallito (MongoDB non pronto o credenziali errate). Riprovo in 2 secondi..."
  sleep 2
done

# Riattiviamo il controllo di sicurezza sugli errori
set -e

echo "Avvio di Apache..."
exec apache2-foreground