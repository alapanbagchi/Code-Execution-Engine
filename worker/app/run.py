import os, filecmp ,sys
import subprocess

codes = {200:'success',404:'file not found',400:'error',408:'timeout'}

def compile(file,lang):
    if(lang =='python3'):
        return 200
    if (os.path.isfile(file)):
        if lang=='c':
            os.system('gcc ' + file)
        elif lang=='cpp':
            os.system('g++ ' + file)
        elif lang=='java':
            os.system('javac ' + file)
        if (os.path.isfile('a.out')) or (os.path.isfile('main.class')):
            return 200
        else:
            return 400
    else:
        return 404

def run(file,input,timeout,lang):
    cmd='sudo -u alapan '
    if lang == 'java':
        cmd += 'java main'
    elif lang=='c' or lang=='cpp':
        cmd += './a.out'
    elif lang=='python3':
        cmd += 'python3 '+ file
    try:
        # Use subprocess to run the command
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        # Use communicate() to send input and get output
        output, err = p.communicate(input.encode(), timeout=int(timeout))
        # Run the subprocess in the background parellelly
        p_status = p.wait()
        print(output)
    except subprocess.TimeoutExpired:
        # Kill the process if timeout
        p.kill()
        return 408
        
    
    #Send the appropriate status code
    if p.returncode == 0:
        return 200
    elif p.returncode == 127:
        return 404
    else:
        return 400

params=sys.argv
file = params[1].split('/')[3]
path = os.getcwd()
folder = params[1].split('/')[2]
path = '../temp/' +folder +'/'

os.chdir(path)
lang = params[2]
timeout = str(min(15,int(params[3])))


testin =  "input.txt"
testout =  "output.txt"

status=compile(file,lang)
if status ==200:
    status=run(file,testin,timeout,lang)
print(codes[status])

