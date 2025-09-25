#!/usr/bin/env python3
"""
Critical Table Data Extractor
Handles complex text data with HTML, newlines, and special characters
"""
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

def escape_sql_value(value):
    """Properly escape a value for SQL insertion"""
    if value is None:
        return 'NULL'
    
    if isinstance(value, bool):
        return 'true' if value else 'false'
    
    if isinstance(value, (int, float)):
        return str(value)
    
    # For strings, we need to escape single quotes and handle special characters
    if isinstance(value, str):
        # Replace single quotes with two single quotes (SQL standard)
        escaped = value.replace("'", "''")
        # Handle backslashes (PostgreSQL uses C-style escapes)
        escaped = escaped.replace("\\", "\\\\")
        return f"'{escaped}'"
    
    # For other types, convert to string and escape
    escaped = str(value).replace("'", "''").replace("\\", "\\\\")
    return f"'{escaped}'"

def extract_table_data(db_name, table_name, user='postgres'):
    """Extract all data from a table with proper escaping"""
    try:
        # Connect to database
        conn = psycopg2.connect(
            host="localhost",
            database=db_name,
            user=user,
            cursor_factory=RealDictCursor
        )
        
        cursor = conn.cursor()
        
        # Get column information
        cursor.execute(f"""
            SELECT column_name, data_type, ordinal_position
            FROM information_schema.columns 
            WHERE table_name = '{table_name}' AND table_schema = 'public'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        column_names = [col['column_name'] for col in columns]
        column_list = ', '.join(column_names)
        

        
        # Fetch all data with consistent ordering for deterministic extraction
        # Use multiple columns for ordering to ensure consistent results
        cursor.execute(f"""
            SELECT * FROM {table_name} 
            ORDER BY {column_names[0]}, {column_names[1] if len(column_names) > 1 else column_names[0]}, {column_names[2] if len(column_names) > 2 else column_names[0]};
        """)
        
        # Process rows in batches to avoid memory issues
        batch_size = 100
        
        while True:
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break
            
            for row in rows:
                # Convert row to list of values in column order
                values = [row[col_name] for col_name in column_names]
                
                # Escape each value properly
                escaped_values = [escape_sql_value(val) for val in values]
                values_str = ', '.join(escaped_values)
                
                # Generate INSERT statement
                print(f"INSERT INTO public.{table_name} ({column_list}) VALUES ({values_str});")
        
        cursor.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(1)
    
    db_name = sys.argv[1]
    table_name = sys.argv[2]
    
    success = extract_table_data(db_name, table_name)
    sys.exit(0 if success else 1)