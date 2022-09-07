import pandas as pd

def main():
    df = pd.read_csv('standardized_etpl.csv', dtype=str)
    if any([df[col].str.contains('\\\\r\\\\n').any() for col in df.columns]):
        raise 'File contains LineFeed replacement token. We need to coordinate a new replacement token'
    df = df.replace('\r?\n', '\\\\r\\\\n', regex=True)
    df.to_csv('standardized_etpl_for_data_migration.csv', index=False, encoding='utf-8-sig', line_terminator='\r\n')


if __name__ == '__main__':
    main()
