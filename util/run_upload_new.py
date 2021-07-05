import sys
from uploadFile import uploadFile

file = input()
uploadFile(sys.argv[1], file, sys.argv[2])

