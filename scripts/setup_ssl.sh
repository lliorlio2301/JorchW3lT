#!/bin/bash
# SSL Setup Script für JorchOS (Debian 12)
# ==============================================================================

# Überprüfung auf Root-Rechte
if [ "$EUID" -ne 0 ]; then
  echo "Bitte als root ausführen (sudo ./setup_ssl.sh)"
  exit
fi

echo "--- 1. Installiere Certbot und Nginx-Plugin ---"
apt update
apt install -y certbot python3-certbot-nginx

echo "--- 2. Nginx-Konfiguration vorbereiten ---"
# Kopiere die Vorlage (muss im selben Verzeichnis liegen)
if [ -f "nginx_jorchos.conf" ]; then
    cp nginx_jorchos.conf /etc/nginx/sites-available/jorchos
    ln -s /etc/nginx/sites-available/jorchos /etc/nginx/sites-enabled/
    rm /etc/nginx/sites-enabled/default 2>/dev/null
    echo "Nginx-Vorlage wurde nach /etc/nginx/sites-available/jorchos kopiert."
else
    echo "FEHLER: nginx_jorchos.conf nicht im aktuellen Verzeichnis gefunden!"
    exit 1
fi

echo "--- 3. Domain-Konfiguration ---"
echo "Bitte gib deine Domain ein (z.B. jorch-os.de oder portfolio.de):"
read DOMAIN

# Ersetze Platzhalter in der Nginx-Konfig
sed -i "s/DEINE_DOMAIN/$DOMAIN/g" /etc/nginx/sites-available/jorchos

echo "--- 4. Teste Nginx Konfiguration ---"
nginx -t
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "Nginx neu geladen."
else
    echo "Nginx Konfiguration fehlerhaft. Bitte prüfen."
    exit 1
fi

echo "--- 5. Erstelle SSL-Zertifikat via Let's Encrypt ---"
certbot --nginx -d "$DOMAIN"

echo "-------------------------------------------------------"
echo "SSL SETUP ABGESCHLOSSEN!"
echo "Deine Seite sollte nun unter https://$DOMAIN erreichbar sein."
echo "Certbot hat die automatische Erneuerung (Renewal) bereits als Cronjob/Timer eingerichtet."
echo "-------------------------------------------------------"
