from const import CSV_FILES, CSV_FILES
import csv_checker as cc
from io import StringIO
import io
import os
from os import path
import csv
import paramiko
import subprocess
import socket 

def is_valid_csv(file_in_str):
    try:
        csv.Sniffer().sniff(file_in_str)
    except csv.Error:
        return False

    return True
    
def uploadFile(id, file, fileName):

    if len(file) > 0:

        train_file_bytes = 0
        train_file_str = file

        id = str(id)
        hello = cc.CSVsChecker(train_file_str, train_file_bytes)
        try:
            is_train_valid = hello.clean()
        except:
            print({'err': 'Your CSV contains headers with commas'})

        if not is_train_valid:
            return JsonResponse({'err': 'Invalid CSV Uploaded'})

        try:
            put_file('remote.cs.ubc.ca', 'blkbx-ml', '1qaz2wsx', CSV_FILES + "/" + id, fileName, hello.csv)

        except Exception as e:
            print({'err': 'You file could not be saved on our servers'})
            print(e)

        return print({'success': id})
    else:
        return print({'err': 'Uploaded file is empty'})

def put_file(host, username, password, dirname, filename, data):
    ssh1 = paramiko.SSHClient()
    ssh1.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh1.connect(host, username=username, password=password)
    vmtransport = ssh1.get_transport()
    dest_addr = ('borg', 22)
    local_addr = (socket.gethostbyname(socket.gethostname()), 22)
    vmchannel = vmtransport.open_channel("direct-tcpip", dest_addr, local_addr)

    ssh2 = paramiko.SSHClient()
    ssh2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh2.connect('borg', username=username, password=password, sock=vmchannel)


    try:
        sftp = ssh2.open_sftp()
        try:
            sftp.chdir(dirname)
        except IOError:
            sftp.mkdir(dirname)
        f = sftp.open(dirname + '/' + filename, 'w')
        f.write(data)
        f.close()
    except Exception as e:
        print(e) 
    ssh2.close()
    ssh1.close()