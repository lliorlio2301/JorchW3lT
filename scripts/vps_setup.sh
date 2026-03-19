# !/bin/bash
# VPS Setup Script für Debian 12 (Rootless Podman & Isoliertes Projekt-Konto)
# ==============================================================================

# 1. System-Update & Basis-Tools
echo "--- Aktualisiere System-Pakete ---"
apt update && apt upgrade -y
apt install -y podman podman-compose nginx ufw acl curl git uidmap dbus-user-session

# 2. Projekt-Benutzer anlegen (Isolierung)
# Dieser Benutzer wird für alle Deployments genutzt, NICHT root.
echo "--- Erstelle Projekt-Benutzer 'jorchadmin' ---"
if id "jorchadmin" &>/dev/null; then
  echo "Benutzer jorchadmin existiert bereits."
else
  useradd -m -s /bin/bash jorchadmin
  echo "Bitte setze jetzt ein Passwort für den Benutzer 'jorchadmin':"
  passwd jorchadmin
fi

# 3. Rootless Podman Konfiguration (WICHTIG für Debian 12)
echo "--- Konfiguriere Rootless Podman & Linger ---"
# Linger sorgt dafür, dass die Container beim Ausloggen NICHT gestoppt werden
loginctl enable-linger jorchadmin

# Sub-UID/GID Mapping für Rootless-Containern sicherstellen
if ! grep -q "jorchadmin" /etc/subuid; then
  echo "jorchadmin:100000:65536" >>/etc/subuid
  echo "jorchadmin:100000:65536" >>/etc/subgid
fi

# 4. Firewall (UFW) - Nur das Nötigste erlauben
echo "--- Konfiguriere Firewall ---"
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw --force enable

# 5. Verzeichnisstruktur für das Projekt vorbereiten
echo "--- Bereite Projektverzeichnisse vor ---"
mkdir -p /home/jorchadmin/app/uploads
chown -R jorchadmin:jorchadmin /home/jorchadmin/app
chmod -R 775 /home/jorchadmin/app

# 6. Nginx-Platzhalter für Reverse Proxy
# (Konfiguration erfolgt später, wenn die Domain feststeht)
echo "--- Setup abgeschlossen ---"
echo "-------------------------------------------------------"
echo "ZUSAMMENFASSUNG:"
echo "1. System ist auf dem neuesten Stand (Debian 12)."
echo "2. Benutzer 'jorchadmin' wurde für das Projekt angelegt."
echo "3. Rootless Podman ist für diesen Benutzer aktiviert."
echo "-------------------------------------------------------"
echo "NÄCHSTE SCHRITTE:"
echo "1. Logge dich auf dem VPS als root aus: exit"
echo "2. Logge dich als Projekt-User ein: ssh jorchadmin@DEINE_VPS_IP"
echo "3. Erstelle dort den SSH-Key für GitHub (ich helfe dir dabei)."
echo "-------------------------------------------------------"
