#!/bin/bash
echo "=== Migration Status Check ==="
echo "Time: $(date)"
echo "Process status:"
ps aux | grep -E "(db-migrate|npm)" | grep -v grep || echo "No migration processes found"
echo
echo "Last 5 lines of log:"
tail -5 db-migrate.log 2>/dev/null || echo "No log available yet"
echo
echo "PostgreSQL active queries:"
psql -U postgres -d d4adlocal -c "SELECT pid, state, LEFT(query, 100) as query_start FROM pg_stat_activity WHERE state != 'idle' AND query NOT LIKE '%pg_stat_activity%';" 2>/dev/null || echo "Cannot check PostgreSQL status"
echo "========================="

