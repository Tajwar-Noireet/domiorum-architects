import asyncio,json
EXE=r'C:\Users\tazwa\AppData\Local\OpenAI\Codex\bin\5ea220ae823df3d7\codex.exe'
async def main():
 p=await asyncio.create_subprocess_exec(EXE,'app-server','--stdio',stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.DEVNULL)
 async def rpc(i,method,params):
  p.stdin.write((json.dumps({'id':i,'method':method,'params':params})+'\n').encode());await p.stdin.drain()
  while True:
   line=await asyncio.wait_for(p.stdout.readline(),20)
   if not line: raise RuntimeError('server closed')
   r=json.loads(line)
   if r.get('id')==i: return r
 try:
  r=await rpc(1,'initialize',{'clientInfo':{'name':'project-diagnostics','version':'1.0'},'capabilities':{'experimentalApi':True}})
  if 'error' in r: print(r);return
  p.stdin.write(b'{"method":"initialized"}\n');await p.stdin.drain()
  print('repair',json.dumps(await rpc(2,'thread/metadata/update',{'threadId':'01a108e4-3a70-7d12-8bee-a2f339177ed8','projectId':'01a108e1-99c6-74f1-b330-f940aa5f4fef','gitInfo':{'branch':'main','originUrl':'https://github.com/Tajwar-Noireet/domiorum-architects.git','sha':'2f0bae9'}})))
  r=await rpc(3,'thread/read',{'threadId':'01a108e4-3a70-7d12-8bee-a2f339177ed8','includeTurns':False})
  if 'error' in r: print(r)
  else:
   t=r['result']['thread']; print('thread',json.dumps({k:t.get(k) for k in ['id','projectId','cwd','gitInfo']}))
 finally:
  p.terminate();await p.wait()
asyncio.run(main())

