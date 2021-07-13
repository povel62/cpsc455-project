import os
from kaggle.api.kaggle_api_extended import KaggleApi

def submitComp(path, msg, ref):
    api = KaggleApi()
    api.authenticate()
    res = api.competition_submit(path,msg,ref, False)
    print(res)

def uploadNewDataset(path):
    # requires file in folder with config json
    api = KaggleApi()
    api.authenticate()
    res = api.dataset_create_new(path)
    print(res)