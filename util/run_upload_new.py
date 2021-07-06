import sys
from uploadFile import put_file,openFile,closeFile,openConnection1,openConnection2,closeConnection
from const import CSV_FILES

ssh1 = openConnection1()
ssh2 = openConnection2(ssh1)
f = openFile(ssh2,CSV_FILES + "/" + sys.argv[1],sys.argv[2])

for line in sys.stdin:
    put_file(f, line)

closeFile(f)
closeConnection(ssh2)
closeConnection(ssh1)