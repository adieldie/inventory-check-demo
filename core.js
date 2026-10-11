/* Barcode checksum routines extracted from the reviewed source; mock state adapter is new. */
(function (root) {
'use strict';
function validEan13(code) {
 if (!/^\d{13}$/.test(code)) return false;
 let sum = 0;
 for (let i=0;i<12;i++) sum += Number(code[i]) * (i%2 ? 3 : 1);
 return ((10-(sum%10))%10) === Number(code[12]);
}
function validEan8(code) {
 if (!/^\d{8}$/.test(code)) return false;
 let sum=0;
 for(let i=0;i<7;i++) sum += Number(code[i])*(i%2 ? 1 : 3);
 return ((10-(sum%10))%10) === Number(code[7]);
}
function validUpcA(code) {
 if (!/^\d{12}$/.test(code)) return false;
 let sum=0;
 for(let i=0;i<11;i++) sum += Number(code[i])*(i%2 ? 1 : 3);
 return ((10-(sum%10))%10) === Number(code[11]);
}
// These are invented demonstration identifiers, not registered commercial product codes.
const catalogue=Object.freeze([
 Object.freeze({code:'2000000000015',name:'Produto de exemplo A',expected:12}),
 Object.freeze({code:'2000000000022',name:'Produto de exemplo B',expected:6}),
 Object.freeze({code:'2000000000039',name:'Produto de exemplo C',expected:4})
]);
class Inventory {
 constructor(){this.counts=new Map();this.history=[];}
 product(code){const p=catalogue.find(p=>p.code===code);if(!p)throw Error('Código fora do catálogo fictício.');return p;}
 quantity(n,zero=false){if(!Number.isSafeInteger(n)||n<(zero?0:1)||n>100000)throw Error('Use uma quantidade inteira válida.');return n;}
 set(code,n){this.product(code);this.quantity(n,true);const previous=this.counts.get(code)||0;this.counts.set(code,n);this.history.push({code,delta:n-previous,total:n});return n;}
 scan(code,quantity=1,pack=1){this.product(code);this.quantity(quantity);this.quantity(pack);return this.set(code,(this.counts.get(code)||0)+quantity*pack);}
 rows(){return catalogue.map(p=>({...p,count:this.counts.get(p.code)||0,difference:(this.counts.get(p.code)||0)-p.expected}));}
 reset(){this.counts.clear();this.history=[];}
}
const api={validEan13,validEan8,validUpcA,catalogue,Inventory};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.InventoryDemo=api;
})(globalThis);
