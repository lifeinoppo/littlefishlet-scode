
import json

json.dump(R,openI('xxx.txt','w'));
open(*).read();

json.load(open(*));


R = dict(title=xx,pub=xx,year=xx);
J = json.dumps(R,indent=4);
p = json.loads(J)



import random 
random.random();
random.randint(1,10)

L = [1,2,3,4];
random.shuffle(L);    # �͵ش��ң� ϴ���

random.choice(L);   # ѡ�������


from subprocess import call,Popen,PIPE
pipe = Popen('python m.py -x',stdout=PIPE)
pipe.stdout.read()
pipe.wait();






