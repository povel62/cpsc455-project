import os

try:
    DEBUG = bool(int(os.environ['DEBUG']))
except:
    DEBUG = False

if DEBUG:
    CSV_FILES = './bbml/users_csv'
    DEMO_TRAIN_FILES = './bbml/Train'
    DEMO_PREDICT_FILES = './bbml/Predict'
else:
    CSV_FILES = '/ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared_2/ensemble_squared/datasets'
    SESSIONS = '/ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared_2/ensemble_squared/sessions'

    # DEMO_TRAIN_FILES = '/ubc/cs/research/plai-scratch/BlackBoxML/demo_csv/Train'
    # DEMO_PREDICT_FILES = '/ubc/cs/research/plai-scratch/BlackBoxML/demo_csv/Predict'