from const import CSV_FILES,SESSIONS
import csv_checker as cc
from io import StringIO
import io
import os
from os import path
import csv
import paramiko
import subprocess
import socket
import pandas as pd

def is_valid_csv(file_in_str):
    try:
        csv.Sniffer().sniff(file_in_str)
    except csv.Error:
        return False

    return True

def openConnection1():
    print("Getting connection 1")

    host = 'remote.cs.ubc.ca'
    username = 'blkbx-ml'
    password = '1qaz2wsx'
    ssh1 = paramiko.SSHClient()
    ssh1.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh1.connect(host, username=username, password=password)

    return ssh1

def openConnection2(ssh1):
    print("Getting connection 2")

    host = 'remote.cs.ubc.ca'
    username = 'blkbx-ml'
    password = '1qaz2wsx'
    vmtransport = ssh1.get_transport()
    dest_addr = ('borg', 22)
    local_addr = (socket.gethostbyname(socket.gethostname()), 22)
    vmchannel = vmtransport.open_channel("direct-tcpip", dest_addr, local_addr)

    ssh2 = paramiko.SSHClient()
    ssh2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh2.connect('borg', username=username, password=password, sock=vmchannel)
    return ssh2

def closeConnection(ssh):
    print("Closing connection")
    ssh.close()

def uploadFile(ssh2, id, fileName, file):
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
            put_file(ssh2, 'remote.cs.ubc.ca', 'blkbx-ml', '1qaz2wsx', CSV_FILES + "/" + id, fileName, hello.csv)

        except Exception as e:
            print({'err': 'You file could not be saved on our servers'})
            print(e)

        return print({'success': id})
    else:
        return print({'err': 'Uploaded file is empty'})

def put_file(f, data):
    try:
        print("Writing data: " + data)
        f.write(data)
    except Exception as e:
        print(e)

def closeFile(f):
    try:
        print("Closing file")
        f.close()
    except Exception as e:
        print(e)

def copy_file(ssh2, localfilepath, id, filename):
    try:
        dirname = CSV_FILES + "/" + id
        print("Opening Dir: " + dirname)
        sftp = ssh2.open_sftp()
        # mode = 'a'
        try:
            sftp.chdir(dirname)
        except IOError:
            print("Making Dir: " + dirname)
            sftp.mkdir(dirname)
        print("Putting file remotely")
        sftp.put(localfilepath, dirname + '/' + filename)
        print("File successfuly opened")
        # return f
    except Exception as e:
        print(e)

def copy_file_back_to_local(ssh2, localfilepath, id, filename, cols):
    try:
        dirname = SESSIONS + "/" + id + "/predictions"
        print("Opening Dir: " + dirname)
        sftp = ssh2.open_sftp()
        print("Putting file remotely")
        dlname = localfilepath
        if(len(cols) != 0):
            dlname = dlname + "_temp"
        sftp.get(dirname + '/' + filename, dlname)
        print("File successfuly downloaded")
        # print(cols[0])
        if(len(cols) != 0):
            with open(dlname,"r+") as file:
                frame = pd.read_csv(file,usecols=cols)
                frame.to_csv(localfilepath, index=False)
                print(dlname)
            os.unlink(dlname)    
        # return f
    except Exception as e:
        print(e)

def copy_error_file_back_to_local(ssh2, localfilepath, id, fileName):
    try:
        dirname = SESSIONS + "/" + id + "/logs/t5_s0/" + fileName
        print("Opening Dir: " + dirname)
        sftp = ssh2.open_sftp()
        print("Putting file remotely")
        sftp.get(dirname, localfilepath)
        print("File successfuly downloaded")
    except Exception as e:
        print(e)

def get_pred_files_names(id):
    get_pred_files('remote.cs.ubc.ca', 'blkbx-ml', '1qaz2wsx', SESSIONS + "/" + id + "/predictions")

def get_prediction_file(id, name):
    get_pred_file_text('remote.cs.ubc.ca', 'blkbx-ml', '1qaz2wsx', SESSIONS + "/" + id + "/predictions/" + name)

def get_pred_file_text(host, username, password, dirname):
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
        stdin, stdout, stderr = ssh2.exec_command("cat " + dirname)

        error = stderr.readlines()
        out = stdout.readlines()

        # print(error)
        print(out)
        # print(command)

        stdin.close()

    except Exception as e:
        ssh2.close()
        ssh1.close()

def get_pred_files(host, username, password, dirname):
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

        stdin, stdout, stderr = ssh2.exec_command("ls -tr " + dirname)

        error = stderr.readlines()
        out = stdout.readlines()

        # print(error)
        print(out)
        # print(command)

        stdin.close()

    except Exception as e:
        ssh2.close()
        ssh1.close()
