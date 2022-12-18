import json 

with open('someluts.json', 'r') as f: 
    some1 = json.loads(f.read())

with open('someluts2.json', 'r') as f: 
    some2 = json.loads(f.read())

with open('luts.json', 'r') as f: 
    some3 = json.loads(f.read())
some = {}
i = -1
for l in some1.keys():
    i = i + 1
    if l not in some:
        some[l] = []
    for lut in some1[l]:
        some[l].append(lut)
i = -1
for l in some2.keys():
    i = i + 1
    if l not in some:
        some[l] = []
    for lut in some2[l]:
        some[l].append(lut)
i = -1
for l in some3.keys():
    i = i + 1
    if l not in some:
        some[l] = []
    for lut in some3[l]:
        some[l].append(lut)
with open ('./lutsnew.json', 'w') as f:
    f.write(json.dumps(some))