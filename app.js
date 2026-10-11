'use strict';
const {Inventory,catalogue,validEan13}=InventoryDemo;
const inventory=new Inventory();
const $=id=>document.getElementById(id);
const message=text=>{$('message').textContent=text;};
function cell(row,text){const td=document.createElement('td');td.textContent=text;row.append(td);return td;}
function render(){
 $('rows').replaceChildren();
 for(const p of inventory.rows()){
  const row=document.createElement('tr');cell(row,p.name+' · '+p.code);cell(row,p.expected);
  const td=cell(row,'');const input=document.createElement('input');input.type='number';input.min='0';input.max='100000';input.step='1';input.value=p.count;input.setAttribute('aria-label','Corrigir contagem de '+p.name);td.append(input);
  cell(row,(p.difference>0?'+':'')+p.difference);
  const actions=cell(row,'');const choose=document.createElement('button');choose.textContent='Usar código';choose.onclick=()=>{$('code').value=p.code;$('code').focus();};actions.append(choose);
  const save=document.createElement('button');save.textContent='Corrigir';save.onclick=()=>{try{inventory.set(p.code,Number(input.value));render();message('Contagem corrigida.');}catch(e){message(e.message);}};actions.append(save);$('rows').append(row);
 }
 $('history').replaceChildren();
 for(const h of inventory.history.slice(-20).reverse()){const li=document.createElement('li');li.textContent=catalogue.find(p=>p.code===h.code).name+': '+(h.delta>0?'+':'')+h.delta+' → '+h.total;$('history').append(li);}
}
function scan(code){if(!validEan13(code))throw Error('O código EAN-13 não passou na validação.');const n=inventory.scan(code,Number($('quantity').value),Number($('pack').value));render();message('Leitura registrada. Total: '+n);}
$('scan').onsubmit=e=>{e.preventDefault();try{scan($('code').value.trim());}catch(error){message(error.message);}};
$('reset').onclick=()=>{inventory.reset();render();message('Contagem reiniciada.');};
let stream=null,epoch=0;
function stop(){epoch++;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('video').srcObject=null;$('camera').disabled=false;}
$('stop').onclick=stop;
$('camera').onclick=async()=>{
 if(!('BarcodeDetector' in window)||!navigator.mediaDevices?.getUserMedia){message('Câmera indisponível neste navegador. Use o código manual ou um leitor USB.');return;}
 stop();const session=epoch;$('camera').disabled=true;
 try{
  const formats=await BarcodeDetector.getSupportedFormats();if(!formats.includes('ean_13'))throw Error('Leitura EAN-13 não disponível. Use o modo manual.');
  const detector=new BarcodeDetector({formats:['ean_13']});const acquired=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
  if(epoch!==session){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;$('video').srcObject=stream;await $('video').play();
  let last='',confirmations=0;
  async function frame(){if(epoch!==session)return;try{const results=await detector.detect($('video'));if(epoch!==session)return;const code=results[0]?.rawValue;if(code&&validEan13(code)){confirmations=last===code?confirmations+1:1;last=code;if(confirmations>=2){$('code').value=code;stop();scan(code);return;}}else{last='';confirmations=0;}setTimeout(frame,180);}catch(e){stop();message(e.message);}}
  frame();
 }catch(e){if(epoch===session){stop();message('Não foi possível ler: '+e.message);}}
};
addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});render();
