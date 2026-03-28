#!/bin/bash
# JorchOS Emergency Account Reset
# ==============================================================================

# Ensure script is run as jorchadmin (since podman is rootless)
if [ "$USER" != "jorchadmin" ]; then
    echo "Dieses Skript sollte als 'jorchadmin' ausgeführt werden!"
    exit 1
fi

CONTAINER_NAME="jorge-db"
DB_NAME="jorchos_db"
DB_USER="jorchos_user"

# Standard-Werte aus der initialen Migration (Password: JORGE)
DEFAULT_PASS_HASH='$2a$10$uZ3.OGkQwAsCGKbzQLOwFuXjPwd09Ogp5GTv7FtbtG3PmPzUZ2X1C'

echo "--- JorchOS Account Reset ---"
echo "Dieses Skript setzt den ersten Benutzer in der Datenbank zurück."
echo ""
echo "Bitte gib den neuen Benutzernamen ein (z.B. admin):"
read NEW_USER

if [ -z "$NEW_USER" ]; then
    echo "Fehler: Benutzername darf nicht leer sein."
    exit 1
fi

echo "--- Setze Benutzer '$NEW_USER' und Passwort 'JORGE' ---"

# SQL Befehl ausführen
# Wir setzen ID=1 voraus, da dies der erste erstellte User ist.
podman exec -it "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "UPDATE users SET username = '$NEW_USER', password = '$DEFAULT_PASS_HASH' WHERE id = 1;"

if [ $? -eq 0 ]; then
    echo ""
    echo "SUCCESS: Account wurde zurückgesetzt!"
    echo "-------------------------------------------------------"
    echo "Benutzername: $NEW_USER"
    echo "Passwort:     JORGE"
    echo "-------------------------------------------------------"
    echo "WICHTIG: Bitte logge dich sofort ein und ändere das Passwort"
    echo "über die Account-Verwaltung in der App!"
else
    echo "FEHLER: Konnte Datenbank nicht aktualisieren. Läuft der Container '$CONTAINER_NAME'?"
fi
