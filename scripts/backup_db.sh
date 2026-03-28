#!/bin/bash
# JorchOS Database Backup Script
# ==============================================================================

# Configuration
BACKUP_DIR="/home/jorchadmin/backups/db"
CONTAINER_NAME="jorge-db"
DB_NAME="jorchos_db"
DB_USER="jorchos_user"
KEEP_DAYS=7
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="jorchos_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "--- Starting Database Backup: $TIMESTAMP ---"

# Run pg_dump inside the container
# We use -U for user and the db name. 
# Password is taken from the container's environment variables.
if podman exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/$FILENAME"; then
    echo "SUCCESS: Backup saved to $BACKUP_DIR/$FILENAME"
    
    # Compress the backup
    gzip "$BACKUP_DIR/$FILENAME"
    echo "SUCCESS: Backup compressed to $BACKUP_DIR/$FILENAME.gz"
    
    # Rotation: Delete backups older than KEEP_DAYS
    echo "--- Cleaning up old backups (older than $KEEP_DAYS days) ---"
    find "$BACKUP_DIR" -name "jorchos_backup_*.sql.gz" -mtime +$KEEP_DAYS -exec rm {} \;
    echo "Cleanup finished."
else
    echo "ERROR: Backup failed! Check if container $CONTAINER_NAME is running."
    exit 1
fi

echo "--- Backup Process Finished ---"
