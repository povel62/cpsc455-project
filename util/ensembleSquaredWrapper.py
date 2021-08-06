import os
import paramiko
import subprocess
import socket

try:
    DEBUG = bool(int(os.environ['DEBUG']))
except:
    DEBUG = False

# RUN commands
predict_command = "/opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
        --error=/ubc/cs/research/plai-scratch/BlackBoxML/error.err\
        --output=/ubc/cs/research/plai-scratch/BlackBoxML/out.out\
        /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared_2/ensemble_squared/run-client-produce-bm.sh\
        {job_id} '{job_name}' {test_file_name} {timer} '{target_col}' {email} {callback_url}"

train_command = "/opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
        --error=/ubc/cs/research/plai-scratch/BlackBoxML/error.err\
        --output=/ubc/cs/research/plai-scratch/BlackBoxML/out.out\
        /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared_2/ensemble_squared/run-client-search-bm.sh\
        {job_id} '{job_name}' {csv_file_name} {timer} '{target_col}' {email} {callback_url}"

# TRAIN
def train_pipeline(csv_file_name: str, job_id: str, timer: int, target_name: str, email: str, job_name: str, callback_url: str):
    if DEBUG:
        # Can potentially change to local_train_pipeline, if ensemble-squared can be ran locally
        print(train_command.format(job_id=job_id, csv_file_name=csv_file_name, email=email, target_col=target_name, timer=timer, job_name=job_name))
        return True, None
    else:
        return run_borg_command(train_command.format(job_id=job_id, csv_file_name=csv_file_name, email=email, target_col=target_name, timer=timer, job_name=job_name, callback_url=callback_url))

# PREDICT
def run_predict(csv_file_name: str, job_id: str, timer: int, target_name: str, email: str, job_name: str, callback_url: str):
    if DEBUG:
        print(predict_command.format(test_file_name=csv_file_name, job_id=job_id, email=email, target_col=target_name, timer=timer, job_name=job_name))
        return True, None
    else:
        return run_borg_command(predict_command.format(test_file_name=csv_file_name, job_id=job_id, email=email, target_col=target_name, timer=timer, job_name=job_name, callback_url=callback_url))

## Optional: API
def run_raw_evaluation(dataset_name: str, ta2_id: str, train_dir: str, test_dir: str, target_col: int, timeout: int, id: int):
    return run_borg_command(raw_eval_command.format(id=id, ta2_id=ta2_id, raw_dataset=dataset_name, train_dir=train_dir, test_dir=test_dir, target_col=target_col, timeout=timeout))


def local_train_pipeline(csv_file_name: str, target_col: str, email: str, job_id: str='plzwork'):
    # command = 'ls; python3 common/run.py -f 1 -x {} -y {} -p 1 -u {}'.format(csv_file_name, csv_file_name, email)
    print(f"TARGET COL: {target_col}, job_id: {job_id}")
    command = f'cd /home/jasonyoo/code/plai/automl/ensemble_squared && python3 -m ensemble_squared search -n {job_id} -x configs/local.json -f {csv_file_name} -t 1 -c {target_col} -b autogluontab -e {email}'
    process = subprocess.Popen(command, shell=True)
    out, err = process.communicate()
    print(out)
    print(err)
    return True, 'done'

# RUN SLURM submission
def run_borg_command(command: str):
    try:
        ssh1 = paramiko.SSHClient()
        ssh1.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh1.connect('remote.cs.ubc.ca', username=os.environ.get('SSH_USER'), password=os.environ.get('SSH_PASSWORD'))

        vmtransport = ssh1.get_transport()
        dest_addr = ('borg', 22)
        local_addr = (socket.gethostbyname(socket.gethostname()), 22)
        vmchannel = vmtransport.open_channel("direct-tcpip", dest_addr, local_addr)

        ssh2 = paramiko.SSHClient()
        ssh2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh2.connect('borg', username=os.environ.get('SSH_USER'), password=os.environ.get('SSH_PASSWORD'), sock=vmchannel)

        stdin, stdout, stderr = ssh2.exec_command(command)

        error = stderr.readlines()
        out = stdout.readlines()

        print(error)
        print(out)
        print(command)

        stdin.close()
        ssh2.close()
        ssh1.close()
        return True, ''
    except Exception as e:
        return False, str(e)

def run_ubc_command(command: str):
    try:
        ssh1 = paramiko.SSHClient()
        ssh1.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh1.connect('remote.cs.ubc.ca', username=os.environ.get('SSH_USER'), password=os.environ.get('SSH_PASSWORD'))
        vmtransport = ssh1.get_transport()
        dest_addr = ('borg', 22) #edited#
        local_addr = (socket.gethostbyname(socket.gethostname()), 22) #edited#
        vmchannel = vmtransport.open_channel("direct-tcpip", dest_addr, local_addr)

        ssh2 = paramiko.SSHClient()
        ssh2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh2.connect('borg', username=os.environ.get('SSH_USER'), password=os.environ.get('SSH_PASSWORD'), sock=vmchannel)


        stdin, stdout, stderr = ssh2.exec_command("cd /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/datasets \n " + command)

        error = stderr.readlines()
        out = stdout.readlines()

        print(error)
        print(out)
        print(command)

        stdin.close()

        return True, ''
    except Exception as e:
        return False, str(e)        




# data = 'This is arbitrary data\n'.encode('ascii')
# put_file('v13', 'rob', '/tmp/dir', 'file.bin', data)