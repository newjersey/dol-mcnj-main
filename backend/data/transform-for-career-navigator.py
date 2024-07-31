import csv
import requests
import logging
from requests.exceptions import RequestException
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Append a timestamp to the output file name to make it unique
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
input_file_path = 'standardized_etpl.csv'
output_file_path = f'cn_training_{timestamp}.csv'

# Define the output columns for the CSV file
output_columns = [
    "training_id", "title", "area", "link", "duration", "soc", "roi", "soc3", "id", "method",
    "soc_name", "location", "title_en", "soc_name_en", "title_es", "soc_name_es", "title_tl",
    "soc_name_tl", "title_zh", "soc_name_zh", "title_ja", "soc_name_ja", "duration_units",
    "duration_slider_val_min", "duration_slider_val_max", "duration_units_en", "duration_units_es",
    "duration_units_tl", "duration_units_zh", "duration_units_ja"
]

# Dictionary for calendar length conversion
calendarlength_dict = {
    "1": 0.14,
    "2": 0.21,
    "3": 0.71,
    "4": 3.0,
    "5": 10.0,
    "6": 15.0,
    "7": 35.0,
    "8": 100.0,
    "9": 200.0,
    "10": 300.0
}


# Initialize a session for API requests to reuse the connection
session = requests.Session()
adapter = requests.adapters.HTTPAdapter(pool_connections=100, pool_maxsize=100)
session.mount('http://', adapter)
session.mount('https://', adapter)

# Cache for storing previously fetched SOC values
soc_cache = {}

def fetch_socs(cip):
    """Fetch the SOC values from the API for a given CIP, with caching."""
    if cip in soc_cache:
        logging.debug(f"Using cached SOCs for CIP: {cip}")
        return soc_cache[cip]
    try:
        logging.debug(f"Fetching SOCs for CIP: {cip}")
        response = session.get(f'http://localhost:8080/api/occupations/cip/{cip}')
        response.raise_for_status()  # This will raise an exception for HTTP errors
        socs = response.json()
        if socs:
            logging.debug(f"Received SOCs for CIP {cip}: {[soc['soc'] for soc in socs]}")
        else:
            logging.debug(f"No SOCs found for CIP {cip}")
        soc_cache[cip] = socs
        return socs
    except RequestException as e:
        logging.error(f"Error fetching SOCs for CIP {cip}: {e}")
        return []

def process_row(row):
    """Process a single row and return the output rows."""
    cip_code = row["cipcode"].zfill(6)  # Prepends zeros to make the CIP code 6 digits if it's not already
    socs = fetch_socs(cip_code)
    output_rows = []
    for soc in socs:
        soc_code = soc["soc"].replace("-", "")
        soc_name = soc.get("title", "Unknown")
        duration = float(calendarlength_dict.get(row.get("calendarlengthid"), 0.0))


        output_row = {
            "training_id": row["programid"],
            "title": row["officialname"],
            "area": row["city"],
            "link": f'https://mycareer.nj.gov/training/{row["programid"]}',
            "duration": duration,
            "soc": soc_code,
            "roi": 0,
            "soc3": soc_code[:3],
            "id": f'training#{row["programid"]}',
            "method": "classroom",
            "soc_name": soc_name,
            "location": row["county"],
            "title_en": row["officialname"],
            "soc_name_en": soc_name,
            "title_es": row["officialname"],
            "soc_name_es": soc_name,
            "title_tl": row["officialname"],
            "soc_name_tl": soc_name,
            "title_zh": row["officialname"],
            "soc_name_zh": soc_name,
            "title_ja": row["officialname"],
            "soc_name_ja": soc_name,
            "duration_units": "Weeks",
            "duration_slider_val_min": duration,
            "duration_slider_val_max": duration,
            "duration_units_en": "Weeks",
            "duration_units_es": "Semanas",
            "duration_units_tl": "tuần",
            "duration_units_zh": "周",
            "duration_units_ja": "週間"
        }
        output_rows.append(output_row)
    return output_rows

try:
    with open(input_file_path, mode='r', encoding='utf-8') as infile, open(output_file_path, mode='w', newline='', encoding='utf-8') as outfile:
        reader = list(csv.DictReader(infile))
        writer = csv.DictWriter(outfile, fieldnames=output_columns)
        writer.writeheader()

        # Use ThreadPoolExecutor to process rows in parallel
        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = [executor.submit(process_row, row) for row in reader if row["statusname"] == "Approved"]
            for future in as_completed(futures):
                output_rows = future.result()
                for output_row in output_rows:
                    writer.writerow(output_row)

except Exception as e:
    logging.error(f"Error processing files: {e}")

logging.info(f"File '{output_file_path}' has been successfully created.")
