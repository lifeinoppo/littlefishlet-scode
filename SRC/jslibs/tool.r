
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
random.shuffle(L);    # 就地打乱， 洗牌喽

random.choice(L);   # 选择随机项


from subprocess import call,Popen,PIPE
pipe = Popen('python m.py -x',stdout=PIPE)
pipe.stdout.read()
pipe.wait();






