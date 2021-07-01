import csv
import pandas as pd
from tableschema import Table 

class CSVsChecker():
    '''
    CSV checker that ensures predict and train CSVs columns and column data types correlate.
    '''
    def __init__(self, train_csv_path: str, train_csv_bytes):
        '''
        target_idx should be 0 based indexing
        '''
        self.csv = train_csv_path
        self.csv_bytes = train_csv_bytes


    def clean(self):
        if not self._is_valid_csv(self.csv):
            return False
        self._check_and_add_headers()
        return True

        #  train_file = open(self.train_csv_path)
        #  train_reader = csv.reader(train_file)
        #  train_col = set(next(train_reader))

    def _is_valid_csv(self, path: str):
        try:
            csv.Sniffer().sniff(path)
        except csv.Error:
            return False

        return True

    def _check_and_add_headers(self, num_bytes: int = 5000):
        train_file = self.csv

        sniffer = csv.Sniffer()
        has_header_train  = sniffer.has_header(train_file)
        replace = False

        train_EOL_idx = train_file.find('\n')
        possible_cols = train_file[:train_EOL_idx].split(',')
        train_num_col = len(possible_cols)

        if has_header_train:
            for possible_header in possible_cols:
                if ',' in possible_header:
                    raise Exception()
                    replace = True
                    break

        if replace == False and has_header_train:
            return
        
        self._csv_add_header(self.csv, train_num_col, replace)

    def _csv_add_header(self, file_path: str, num_col: int, is_replace: bool = False):
        reader  = csv.reader(self.csv)
        headers = [f'col-{i}' for i in range(num_col)]
        header_str = ','.join(headers) + '\r\n'
        #  if is_replace:
        #  df = pd.read_csv(file_path)
        #  df.to_csv(file_path, index=False)
        self.csv = header_str + self.csv


# Check both Train and Test
class CSVsCheckerBoth():
    '''
        CSV checker that ensures predict and train CSVs columns and column data types correlate.
    '''
    def __init__(self, train_csv_path: str, predict_csv_path:str, target_idx: int):
        '''
            target_idx should be 0 based indexing
        '''
        self.train_csv_path = train_csv_path
        self.predict_csv_path = predict_csv_path
        self.target_idx = target_idx

    def get_target_idx(self):
        return self.target_idx

    def ensure_csvs_good(self):
        if self._is_valid_csv(self.train_csv_path):
            raise Exception('Train CSV is not a valid CSV')
        elif self._is_valid_csv(self.predict_csv_path):
            raise Exception('Predict CSV is not a valid CSV')

        self._check_and_add_headers()

        train_file = open(self.train_csv_path)
        predict_file = open(self.predict_csv_path)
        train_reader = csv.reader(train_file)
        predict_reader = csv.reader(predict_file)
        train_col = set(next(train_reader))
        predict_col = set(next(predict_reader))

        self._is_columns_dtype_same()

        if train_col == predict_col:
            return
        elif train_col[:self.target_idx:] == predict_col:
            return
        else:
            raise Exception(f'Columns in train: {train_col}, don\'t correspond to columns in predict: {predict_col}')

    def _is_valid_csv(self, path: str):
        file = open(path)

        try:
            csv.Sniffer().sniff(file.read())
            file.close()
            False
        except:
            return True

    def _check_and_add_headers(self, num_bytes: int = 5000):
        train_file = open(self.train_csv_path)
        predict_file = open(self.predict_csv_path)

        sniffer = csv.Sniffer()
        train_first_bytes = train_file.read(num_bytes)
        predict_first_bytes = predict_file.read(num_bytes)
        has_header_train = sniffer.has_header(train_first_bytes)
        has_header_predict = sniffer.has_header(predict_first_bytes)

        train_EOL_idx = train_first_bytes.find('\n')
        predict_EOL_idx = predict_first_bytes.find('\n')

        train_col = train_first_bytes[:train_EOL_idx].split(',')
        predict_col = predict_first_bytes[:predict_EOL_idx].split(',')

        train_num_col = len(train_col)
        predict_num_col = len(predict_col)

        if train_num_col != predict_num_col:
            raise Exception('Predict CSV does not have same columns as Train CSV!')

        if has_header_train and has_header_predict:
            return

        if has_header_train and not has_header_predict:
            train_data = pd.read_csv(self.train_csv_path)
            headers = list(train_data.columns)
            self._csv_add_existing_header(self.predict_csv_path, headers)
        elif not has_header_predict and not has_header_train:
            # Create same number of columns for train and test
            self._csv_add_header(self.train_csv_path, train_num_col)
            self._csv_add_header(self.predict_csv_path, train_num_col)

    def _csv_add_header(self, file_path: str, num_col: int, is_replace: bool = False):
        headers = [f'col-{i}' for i in range(num_col)]
        header = 0 if is_replace else None
        df = pd.read_csv(file_path, names=headers, header=header)
        df.to_csv(file_path, index=False)

    def _csv_add_existing_header(self, file_path, headers):
        df = pd.read_csv(file_path, header=None)
        df.columns = headers
        df.to_csv(file_path, index=False)

    def _remove_target_col_from_predict(self):
        train_df = pd.read_csv(self.train_csv_path)
        predict_df = pd.read_csv(self.predict_csv_path)

        self.target_col_name = train_df.columns[self.target_idx]

        try:
            predict_df.drop(column=[self.target_col_name])
            predict_df.to_csv(self.predict_csv_path, index=False)
            return
        except Exception:
            return

    def _is_columns_dtype_same(self, row_limit: int = 500, confidence: float = 0.85):
        train_table = Table(self.train_csv_path)
        predict_table = Table(self.predict_csv_path)
        train_schema = train_table.infer(limit=row_limit, confidence=confidence)
        predict_schema = predict_table.infer(limit=row_limit, confidence=confidence)

        train_fields = train_schema['fields']
        predict_fields = predict_schema['fields']

        train_col_names = [d['name'] for d in train_fields]
        predict_col_names = [d['name'] for d in predict_fields]

        num_col_diff = 0
        for predict_dict in predict_fields:
            predict_dtype = predict_dict['type']
            predict_name = predict_dict['name']

            train_idx = train_col_names.index(predict_name)
            train_dict = train_fields[train_idx]
            train_dtype = predict_dict['type']

            if train_dtype != predict_dtype:
                raise Exception(f'Column: {predict_name} have different data types between train and predict CSV')