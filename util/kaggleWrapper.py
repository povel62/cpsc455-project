import os
# import kaggle as kg
from kaggle.api.kaggle_api_extended import KaggleApi

def submitComp(path, msg, ref):
    # print(os.environ)
     
    api = KaggleApi()
    api.authenticate()
    # leaderboard = api.competition_view_leaderboard('titanic')
    # print(leaderboard)
    # api.competition_submit('gender_submission.csv','API Submission','titanic')
    res = api.competition_submit(path,msg,ref, False)
    print(res)

# def 