import csv
import requests
import logging
from requests.exceptions import RequestException
from datetime import datetime

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
    "1": "0.14",
    "2": "0.21",
    "3": "0.71",
    "4": "3",
    "5": "10",
    "6": "15",
    "7": "35",
    "8": "100",
    "9": "200",
    "10": "300"
}

# Initialize a session for API requests to reuse the connection
session = requests.Session()

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


try:
    with open(input_file_path, mode='r', encoding='utf-8') as infile, open(output_file_path, mode='w', newline='',
                                                                           encoding='utf-8') as outfile:
        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=output_columns)
        writer.writeheader()

        for row in reader:
            logging.debug(f"Processing row with program ID: {row['programid']}")
            socs = fetch_socs(row["cipcode"])
            for soc in socs:
                # Clean up SOC code by removing hyphens
                soc_code = soc["soc"].replace("-", "")
                duration = calendarlength_dict.get(row["calendarlengthid"])

                output_row = {
                    "training_id": row["programid"],
                    "title": row["officialname"],
                    "area": row["city"],
                    "link": f'https://mycareer.nj.gov/training/{row["programid"]}',
                    "duration": duration,
                    "soc": soc_code,
                    "roi": 0,
                    "soc3": soc_code[0:3],
                    "id": f'training#{row["programid"]}',
                    "method": "classroom",
                    "soc_name": soc["title"],
                    "location": row["county"],
                    "title_en":  row["officialname"],
                    "soc_name_en": soc["title"],
                    "title_es": row["officialname"],
                    "soc_name_es": soc["title"],
                    "title_tl": row["officialname"],
                    "soc_name_tl": soc["title"],
                    "title_zh": row["officialname"],
                    "soc_name_zh": soc["title"],
                    "title_ja": row["officialname"],
                    "soc_name_ja": soc["title"],
                    "duration_units": "Weeks",
                    "duration_slider_val_min": duration,
                    "duration_slider_val_max": duration,
                    "duration_units_en": "Weeks",
                    "duration_units_es": "Semanas",
                    "duration_units_tl": "tuần",
                    "duration_units_zh": "周",
                    "duration_units_ja": "週間"
                }
                try:
                    writer.writerow(output_row)
                except Exception as write_error:
                    logging.error(f"Error writing row for program ID {row['programid']}: {write_error}")

except Exception as e:
    logging.error(f"Error processing files: {e}")

logging.info(f"File '{output_file_path}' has been successfully created.")