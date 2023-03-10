// Git: https://github.com/lleokaganov/alzymologist-resistors

// R24 5%
var E24=[1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3,
     3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 99999999];

var E24num={}; for(var i=0;i<E24.length-1;i++) { E24num[1*E24[i]]=i; }

// E96 1%
var E96=[1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.30, 1.33, 1.37, 1.40,
     1.43, 1.47, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82, 1.87, 1.91, 1.96, 2.00,
     2.05, 2.10, 2.16, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.80, 2.87,
     2.94, 3.01, 3.09, 3.16, 3.24, 3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12,
     4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.90,
     6.04, 6.19, 6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32, 7.50, 7.68, 7.87, 8.06, 8.25, 8.45,
     8.66, 8.87, 9.09, 9.31, 9.53, 9.76, 99999999];

var E96num={}; for(var i=0;i<E96.length-1;i++) { E96num[1*E96[i]]=i; }

var M96={
'0.001':'Z',
'0.01':['Y','R'],
'0.1':['X','S'],
'1':'A',
'10':['B','H'],
'100':'C',
'1000':'D',
'10000':'E',
'100000':'F'
};



function GO(preurl){
    init_tip(document.querySelector('#mdiv'));
    if(preurl) RZ.resrc(preurl);

    // =========================================
    var canvas = dom('divwebp');
    var c = canvas.getContext('2d');
    c.fillStyle = "grey";
    c.strokeStyle = "black";
    c.lineWidth = 5; // Ширина линии
    c.lineCap = "square";

    // R1
    c.strokeRect(70, 70, 70, 150);
    c.fillRect(72, 72, 66, 146);
    // R2
    c.strokeRect(70, 315, 70, 150);
    c.fillRect(72, 317, 66, 146);

    // верхняя хня
    c.beginPath();
    c.moveTo(70+70/2, 70-2);
    c.lineTo(70+70/2, 6);
    c.lineTo(220, 6);
    c.stroke();

    // Перемычка между R1 и R2
    c.moveTo(70+70/2, 220+2);
    c.lineTo(70+70/2, 315-2);
    c.stroke();
    // и ея кружочек
    c.beginPath();
    c.fillStyle = "black";
    c.arc(105, 266, 6, 0, 180);
    c.fill();
    c.stroke();
    // и ея контактик
    c.moveTo(105,266);
    c.lineTo(221,266);
    c.stroke();

    // Нижняя палочка
    c.moveTo(70+70/2, 315+150+2);
    c.lineTo(70+70/2, 522);
    c.stroke();
    // Земля
    c.fillRect(70+70/2-18, 518, 36, 10);

    // текст: R1 R2
    c.font = "28px serif";
    c.fillText("R1", 150, 70+85);
    c.fillText("R2", 150, 315+85);
    // текст: V s V out
    c.font = "11px serif";
    c.fillText("Vs", 120, 24);
    c.fillText("Vout", 120, 286);

    // =========================================

    // Default
    var stab=dom('rtabselect').value; if(stab!='E96' && stab!='E24') dom('rtabselect').value='E26';
    if(dom('V2').value=='') RZ.set('V2',12);
    domoff('tolV2');
    todom('#tolV2 .absV', dom('V2').value);
    if(dom('V1').value=='') RZ.set('V1',3.3);
    if(dom('R1').value=='') RZ.set('R1','1.1k');
    if(dom('R2').value=='') RZ.set('R2','422');

    setTimeout(function(){RZ.smdAll();},500);

    RZ.Approximate();
}

function noFloat(x) { return Math.round(x*10000)/10000; }

function norm(x) {
    if(x<1) return ( Math.floor(x * 1000) / 1000 );
    return ( Math.floor(x * 100) / 100 );
}

var RZ={

AllOK: function(){ RZ.OK('R1'); RZ.OK('R2'); RZ.OK('V1'); RZ.OK('V2'); },
OK: function(x){ dom(x).classList.remove('bordERR'); /*dom(x).disabled=false; dom(x).setAttribute('mydisabled', 0);*/ },
ER: function(x){ dom(x).classList.add('bordERR'); /*dom(x).disabled=true; dom(x).setAttribute('mydisabled',1);*/ },
// b: function(x){ zabil('buka',vzyal('buka')+"<hr>"+x); },

onf: function(x){ return; x.disabled=false; },
onb: function(x){ return; x.disabled=(x.getAttribute('mydisabled')?true:false); },

get: function(x){
    var v=dom(x).value;
    v=RZ.TabValue(v).value;
    RZ.set(x,v);
    return v;
},

set: function(x,v){
    if(x=='R1' || x=='R2') v=RZ.TabValue(v).pr;
    else if(x=='V1' || x=='V2') { v=norm(v); if(!v) v=''; } // noFloat(v);
    dom(x).value=v;
    f5_save(dom(x).getAttribute('ramsave'), v);
},

// Use E96 or E24
getTabNum: function(){
    var stab=dom('rtabselect').value;
    if(stab=='E96') return E96num;
    if(stab=='E24') return E24num;
    dom('rtabselect').value='E96';
    return E96num;
},

// Use E96 or E24
getTab: function(){
    var stab=dom('rtabselect').value;
    if(stab=='E96') return E96;
    if(stab=='E24') return E24;
    dom('rtabselect').value='E96';
    return E96;
},

dec: function(v) { if(1*v == 0) return {val:1,dec:1};
    var stop=1000;
    var dec=1;
    while(--stop && v < 1) { v*=10; dec/=10; }
    while(--stop && v >= 10) { v/=10; dec*=10; }
    if(stop < 500) alert('error103 stop');
    return {val:noFloat(v),dec:dec};
},

setUnits: function(v) { if(1*v == 0) return {};
    var m='',d=RZ.dec(v).dec;
    var T={
    value:v,
    val:RZ.dec(v).val,
    dec:d
    };
    if(d >= 1000) { m='k'; d/=1000; }
    if(d >= 1000) { m='M'; d/=1000; }
    if(d >= 1000) { m='G'; d/=1000; }
    T.units = m+String.fromCharCode(937);
    T.prval = noFloat(T.val*d);
    T.pr = T.prval+' '+T.units;
    return T;
},

// Convert to Array: {val: Tab value, dec: mul decimal, units: mul units }
TabValue: function(v){ var dec=1; v=''+v;
    if( /[kкКк]/.test(v) ) dec=1000;
    else if( /[MmМм]/.test(v) ) dec=1000000;
    else if( /[Gg]/.test(v) ) dec=1000000000;
    v=dec*( v.replace(/,/g,'.').replace(/[^\d\.]+/g,'') );
    var T=RZ.dec(v);
    v=T.val;
    var last=1, tab=RZ.getTab(); for(var i of tab) {
    if(i > v) {
        v = ( (i-v) > (v-last) ? last : i  );
        break;
    }
    last=i;
    }
    return RZ.setUnits(v*T.dec);
},

calcTolerance: function(R1,R2,V1,V2) {
    var tol=(V2*R2)/(R1+R2);
    var perc=(tol-V1)/V1*100;
    perc=Math.round(perc*100)/100;

    todom('#tolV1 .absV' , norm(tol));
    todom('#tolV1 .percV' , "<span style='color:"+prColor(Math.abs(perc))+"'>"+norm(Math.abs(perc))+"%</span>");

    domon('tolV1');
    RZ.Approximate();
    return tol;
},

ch: function(e){

    var R1=RZ.get('R1');
    var R2=RZ.get('R2');
    var V1=1*dom('V1').value; RZ.set('V1',V1);
    var V2=1*dom('V2').value; RZ.set('V2',V2);

    if(e.id=='V2') { // работаем с полем V2
      if(V2==0) {
        domon('tolV2'); // показать таргет
        return RZ.ER('V2'); // если V2=0 или '' - пометить как расчетное
      } else { // иначе пометить как нормальное и идти дальше
        domoff('tolV2');
        todom('#tolV2 .absV' , V2); // запомнить таргет, но пока не показывать
        todom('#tolV2 .percV' , ''); // запомнить таргет, но пока не показывать
        RZ.OK('V2');
      }
    }

    if( (e.id=='R1' || e.id=='R2') // если работаем с резисторами
    && ( V2==0 || dom("V2").classList.contains("bordERR") ) // и поле V2 хочет обсчета
    && V1!=0 // и поле V1 есть
    ) {
    V2=V1/R2*(R1+R2);
    RZ.set('V2',V2);
    RZ.ER('V2');
    var Vtarget=fromdom('#tolV2 .absV');

    var perc=(V2-Vtarget)/Vtarget*100;
    todom('#tolV2 .percV', "<span style='color:"+prColor(Math.abs(perc))+"'>"+norm(Math.abs(perc))+"%</span>" );
    RZ.Approximate('V2');
    return;
    }

//    RZ.AllOK();

    if(V1 >= V2) {
    RZ.ER('V1'); RZ.ER('V2');
    if(V1===0 && V2===0) {
        dom('V2').value=V2=12;
        dom('V1').value=V1=3.3;
    } else return;
    }

    if( // Если меняли V1 или V2 или R1(и он не 0)
    e.id=='V1'
    || e.id=='V2'
    || (e.id=='R1' && R1!==0)
    ) {
    R2=(R1*V1)/(V2-V1);
    }

    if(e.id=='R2' && R2!==0) { // Если меняли R2
    R1=R2*(V2-V1)/V1;
    }

    // сохранить значения
    R1=RZ.TabValue(R1).value;
    R2=RZ.TabValue(R2).value;
    RZ.set('R1',R1);
    RZ.set('R2',R2);

    // нарисовать токи
    var I = V2 / ( R1 + R2 );
    var W1 = I * ( V2 - V1 );
    var W2 = I * V1;
    dom('W1').innerHTML=RZ.nom(I)+'A&emsp;&emsp;'+RZ.nom(W1)+'W';
    dom('W2').innerHTML=RZ.nom(I)+'A&emsp;&emsp;'+RZ.nom(W2)+'W';

    // нарисовать резисторы
    RZ.smdAll();

    // расчитать погрешность и таблицу
    RZ.calcTolerance(R1,R2,V1,V2);
    return;
},

nom: function(I) { // приведение номиналов в читаемый вид
    var dc=[
	['G',	0.000000001,	1000000000],
	['M',	0.000001,	1000000],
	['k',	0.001,		1000],
	['',	1,		0.5],
	['m',	1000,		0.001],
	['u',	1000000,	0.000001],
	['p',	1000000000,	0.000000001],
	['f',	1000000000000,	0.000000000001],
    ];
    for(var i of dc) if(I > i[2]) return (Math.floor(I*i[1]*100)/100)+'&nbsp;'+i[0];
    return I+'&nbsp;';
},

TabPos: function(i) { var tab=RZ.getTab(), len=tab.length-1;
    var dec=1;
    if(i<0) { dec/=10; i=(len+i)%len; }
    else if(i>=len) { dec*=10; i=i%len; }
    return {i:i,dec:dec};
},

Approximate: function(polle){
    var R1=RZ.get('R1');
    var R2=RZ.get('R2');

    var V1=1*dom('V1').value;
    var V2=1*dom('V2').value;

    var T1=RZ.TabValue(R1);
    var T2=RZ.TabValue(R2);

    var tabnum=RZ.getTabNum();
    var i1=tabnum[1*T1.val], i2=tabnum[1*T2.val];
    if(!i1 && i1!==0) return alert('ert1');
    if(!i2 && i2!==0) return alert('ert2');

    var tab=RZ.getTab();

    var minperc=99999;



    var Vtarget=( polle=='V2' // достать таргет
    ? 1*fromdom('#tolV2 .absV')
    : V1
    );

    var s="<table cellspacing=0 cellpadding=3 border=1 class=br>";
    s+="<tr class='R2'><th></th>";
    for(var y=-5;y<=5;y++) {
	var P2=RZ.TabPos(i2+y), c2=RZ.setUnits( tab[P2.i]*P2.dec*T2.dec ).pr;
	if(y==0) c2="<font color=darkgreen>"+c2+"</font>";
	s+="<th onmouseover='RZ.esmd(this)' onmouseout='RZ.esmdOut(this)'>"+c2+"</th>";
    }
    s+="</tr>";

    for(var x=-5;x<=5;x++) {
    var P=RZ.TabPos(i1+x), q1=RZ.setUnits( tab[P.i]*P.dec*T1.dec ), c1=q1.pr;
    if(x==0) c1="<font color=darkgreen>"+c1+"</font>";
    var c="<th onmouseover='RZ.esmd(this)' onmouseout='RZ.esmdOut(this)'>"+c1+"</th>";
    //------------------
    for(var y=-5;y<=5;y++) {
	var P2=RZ.TabPos(i2+y), q2=RZ.setUnits( tab[P2.i]*P2.dec*T2.dec ), c2=q2.pr;
	if(y==0) c2="<u>"+c2+"</u>";

	if(polle=='V2') { // по V2
	    var tol=(V1/q2.value)*(q1.value+q2.value);
	} else { // иначе по V1
	    var tol=(V2*q2.value)/(q1.value+q2.value);
	}
	    var perc=(tol-Vtarget)/Vtarget*100;

	    perc=Math.round(perc*100)/100;
	c+="<td class='tc' style='color:"+prColor(Math.abs(perc))+"'>"
	    +norm(tol) +'V<div>'+perc+'%</div>'
	    +"</td>";
    minperc=Math.min(minperc,Math.abs(perc));
    }

    //------------------
    s+="<tr>"+c+"</tr>";
    }
    s+="</table>";

    zabil('mestab',s);
    var w=dom('mestab').querySelectorAll("DIV");
    for(var e of w) if(e.innerHTML.replace(/[\-\%]/g,'')==minperc)
e.style.color='white';
// e.style.textDecoration='underline';
},

esmdOut:function(e){
    var R=(e.closest('TR').className=='R2' ? 'R2' : 'R1'); // о каком smd-резисторе речь?
    var w=dom('smd'+R), wx=w.getAttribute('Rold');
    if(wx!=null && wx!='') { w.setAttribute('Rold',''); w.value=wx; } // удалим старое значение
},

esmd:function(e){
    var R=(e.closest('TR').className=='R2' ? 'R2' : 'R1'); // о каком smd-резисторе речь?
    var w=dom('smd'+R), wx=w.getAttribute('Rold');
    if(wx==null || wx=='') w.setAttribute('Rold',w.value); // запомним старое значение
    var x=e.innerHTML.replace(/<[^>]+>/g,''); // взять x
    RZ.smdSet(R, x);
},

smdAll:function(){ RZ.smdSet('R1'); RZ.smdSet('R2'); },

smdSet: function(R,x){
    if(!x) x=dom(R).value;
    var w=dom('smd'+R); if(!w) { alert('nw: '+R); return; }
    var T=RZ.TabValue(x);

    var tabnum=RZ.getTabNum();
    var s='';
    if(tabnum==E24num) {
    x=T.val*10;
    if(T.dec < 0.01) s='';
    else if(T.dec == 0.01) s='R0'+x;
    else if(T.dec == 0.1) s='R'+x;
    else if(T.dec == 1) s=Math.floor(x/10)+'R'+ (x%10);
    else s=''+x+((((''+T.dec).replace(/[^0]+/g,'')).length)-1);
        w.value=s;
    } else if(tabnum==E96num) {
    x=E96num[''+T.val]+1; if(x<10) x='0'+x;
    var d=M96[T.dec/100];
    if(typeof(d)=='undefined') return w.value=''; // idie('nknown d='+T.val);
    if(typeof(d)=='object') d=d[0];
    w.value=x+''+d;
    } else alert('err23');
},

esmdIn(e) { var v=e.value; v=v.toUpperCase(); e.value=v; RZ.smdIn( e.id.replace(/^smd/g,'') ,v ); },
smdIn(R,v) {
    v=v.toUpperCase();
    if(v.length!=3 && !( v.substring(0,2)=='R0' && v.length==4 ) ) return salert('Error smd',500);
    var tabnum=RZ.getTabNum();
    if(tabnum==E24num) {
    if(v.indexOf('R')>=0) v=1*('0'+v.replace(/R/g,'.'));
    else {
        var d=1*(v.substring(2,3));
        v=1*(v.substring(0,2));
        for(var i=0;i<d;i++) v*=10;
    }
    } else if(tabnum==E96num) {

/*
EIA-96 code examples:
    01Y = 100 x 0.01 = 1
    68X = 499 x 0.1 = 49.9
    76X = 604 x 0.1 = 60.4
    01A = 100 x 1 = 100
    29B = 196 x 10 = 1.96k
    01C = 100 x 100 = 10k
*/

    var d=v.substring(2,3);
    v=1*(v.substring(0,2));
    v=E96[v-1]*100;

    var dec=0;
    for(var i in M96) {
        if(typeof(M96[i])!='object') {
	if(M96[i]==d) { dec=i; break; }
        } else {
	for(var j of M96[i]) if(j==d) { dec=i; break; }
        }
    }
    if(!dec) return salert('Value='+v+', smd prefix error: **'+h(d),1000);
    v=v*dec;
    } else alert('err23');

    RZ.set(R,v);
},

selecttab: function(){
    var R1=RZ.get('R1'); R1=RZ.TabValue(R1).value; RZ.set('R1',R1);
    var R2=RZ.get('R2'); R2=RZ.TabValue(R2).value; RZ.set('R2',R2);
    RZ.Approximate();
},

resrc: function(preurl){ // заменить все картинки на нужный урл
    var p=document.querySelectorAll('#mdiv IMG');
    for(var e of p) e.src=preurl+e.src.replace(/^.*\//g,'');
},

key: function(e) {
    var event=window.event;
    if(event.code=='ArrowUp') var k=+1;
    else if(event.code=='ArrowDown') var k=-1;
    else return;

    var R=RZ.get(e.id); // взять значение
    var T=RZ.TabValue(R); // взять таблицу, где будет val и dec

    var tabnum=RZ.getTabNum(); // взять систему 5% или 1%
    var i=tabnum[1*T.val]; // взять его номер в таблице
    var tab=RZ.getTab(); // взять всю таблицу
    var P=RZ.TabPos(i+k);
    var dec=P.dec*T.dec;
    if(dec >= 0.01 && dec < 100000000000 ) {
        e.value=RZ.setUnits( tab[P.i]*dec ).pr;
    RZ.smdSet(e.id);
        RZ.ch(e);
    }
},

};


function dom(id){
    if(typeof(id)=='object') return id || false;
    if(id.indexOf(' ')>=0 || id.indexOf('#')>=0 || id.indexOf('.')>=0) return document.querySelector(id) || false;
    return document.getElementById(id) || false;
}

function domon(id) { id=dom(id); if(id && id.style) id.style.display='block'; }
function domoff(id) { id=dom(id); if(id && id.style) id.style.display='none'; }

function todom(id,s) { id=dom(id); if(id) id.innerHTML=s; }
function fromdom(id,s) { id=dom(id); return (id?id.innerHTML:''); }

function domdel(id) { id=dom(id); if(id) setTimeout(function(){id.parentNode.removeChild(id);},10); }

function prColor(x) { x=1*x;
    var from=0;
    var to=12;
    var k = (to-from) / 512;
    var R=0,G=0,B=0;
    var l = (x-from) / k;
    if(l<0) l=0;
    if(l>512) l=512;
    R = Math.round( Math.min(255,l) );
    G = Math.round( Math.min(255, 511-l ) );
    var rgb="rgb("+R+","+G+","+B+")";
    return rgb;
}




idd=function(id){ return (typeof(id)=='object' ? id : ( document.getElementById(id) || false ) ) };
zabil=function(id,text) { if(idd(id)) { idd(id).innerHTML=text; init_tip(idd(id)); } };

f5_save=function(k,v){
    try { return window.localStorage&&window.localStorage.setItem?window.localStorage.setItem(k,v):false; } catch(e) { return err_store(e,arguments.callee.name); }
};

f5_read=function(k){
    try { return window.localStorage&&window.localStorage.getItem?window.localStorage.getItem(k):false; } catch(e) {  return err_store(e,arguments.callee.name); }
};

init_tip=function(w) { w=w||document;
    var attr,j,i,a,s,e,t,el=['input','textarea','select'];
    for(var t of el) {
     for(a of w.getElementsByTagName(t)){
      if(t=='input'||t=='textarea'||t=='select') { // и отключить навигацию для INPUT и TEXTAREA
        attr=a.getAttribute('ramsave');
        if(attr!==null && !a.defaultValue) { // если указан ramsave='name', сохранять в памяти браузера переменную
                if(attr=='') {
                    attr=(a.id?a.id:(a.name?a.name:attr)); // если =1, то имя такое же, как id или name
                    a.setAttribute('ramsave',attr);
                }
                var vv=f5_read(attr) || a.getAttribute('placeholder') || '';
                    if(a.type=='checkbox') a.checked=vv;
                    else if(a.type=='radio') a.checked=(a.value==vv?1:0);
                    else a.value=vv;
                a.addEventListener('change',function(){
                    f5_save(this.getAttribute('ramsave'), ( this.type=='checkbox'
                        || (this.type!='radio' && this.checked) ? (this.checked?1:0) : this.value ) );
                },false);
        }
      }
    }
   }
};

if(typeof(salert)=='undefined') { salert=function(s,nn) { alert(s); }; }
else page_onstart.push('GO()');
