import sys
import json
from uploadFile import copy_file_back_to_local,openConnection1,openConnection2,closeConnection



ssh1 = openConnection1()
ssh2 = openConnection2(ssh1)
# f = openFile(ssh2,CSV_FILES + "/" + sys.argv[1],sys.argv[2])


cols_d = json.loads(sys.argv[4])
cols = cols_d["columns"]
copy_file_back_to_local(ssh2,sys.argv[1],sys.argv[2],sys.argv[3],cols )


# for line in sys.stdin:
#     put_file(f, line)

# closeFile(f)
closeConnection(ssh2)
closeConnection(ssh1)
