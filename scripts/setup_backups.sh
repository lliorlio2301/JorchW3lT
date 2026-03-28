#!/bin/bash
# JorchOS Backup Automation Setup
# ==============================================================================

# Ensure script is run as jorchadmin (not root, since podman is rootless)
if [ "$USER" != "jorchadmin" ]; then
    echo "This script should be run as 'jorchadmin' user!"
    exit 1
fi

BACKUP_SCRIPT="/home/jorchadmin/app/scripts/backup_db.sh"

echo "--- 1. Making backup script executable ---"
chmod +x "$BACKUP_SCRIPT"

echo "--- 2. Setting up Cronjob (Daily at 03:00 AM) ---"
# Check if cronjob already exists
(crontab -l 2>/dev/null | grep -F "$BACKUP_SCRIPT") && echo "Cronjob already exists." || (
    (crontab -l 2>/dev/null; echo "0 3 * * * $BACKUP_SCRIPT >> /home/jorchadmin/backups/backup.log 2>&1") | crontab -
    echo "Cronjob added: Daily at 03:00 AM."
)

echo "--- 3. Testing the backup script ---"
$BACKUP_SCRIPT

echo "-------------------------------------------------------"
echo "BACKUP AUTOMATION SETUP FINISHED!"
echo "Backups are stored in: /home/jorchadmin/backups/db"
echo "Logs are stored in: /home/jorchadmin/backups/backup.log"
echo "-------------------------------------------------------"
