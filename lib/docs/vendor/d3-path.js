// https://d3js.org/d3-path/ Version 1.0.5. Copyright 2017 Mike Bostock.
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i(t.d3=t.d3||{})}(this,function(t){"use strict";function i(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function s(){return new i}var h=Math.PI,_=2*h,e=_-1e-6;i.prototype=s.prototype={constructor:i,moveTo:function(t,i){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+i)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,i){this._+="L"+(this._x1=+t)+","+(this._y1=+i)},quadraticCurveTo:function(t,i,s,h){this._+="Q"+ +t+","+ +i+","+(this._x1=+s)+","+(this._y1=+h)},bezierCurveTo:function(t,i,s,h,_,e){this._+="C"+ +t+","+ +i+","+ +s+","+ +h+","+(this._x1=+_)+","+(this._y1=+e)},arcTo:function(t,i,s,_,e){t=+t,i=+i,s=+s,_=+_,e=+e;var n=this._x1,o=this._y1,r=s-t,a=_-i,u=n-t,c=o-i,f=u*u+c*c;if(e<0)throw new Error("negative radius: "+e);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=i);else if(f>1e-6)if(Math.abs(c*r-a*u)>1e-6&&e){var x=s-n,y=_-o,M=r*r+a*a,l=x*x+y*y,d=Math.sqrt(M),p=Math.sqrt(f),v=e*Math.tan((h-Math.acos((M+f-l)/(2*d*p)))/2),b=v/p,w=v/d;Math.abs(b-1)>1e-6&&(this._+="L"+(t+b*u)+","+(i+b*c)),this._+="A"+e+","+e+",0,0,"+ +(c*x>u*y)+","+(this._x1=t+w*r)+","+(this._y1=i+w*a)}else this._+="L"+(this._x1=t)+","+(this._y1=i);else;},arc:function(t,i,s,n,o,r){t=+t,i=+i,s=+s;var a=s*Math.cos(n),u=s*Math.sin(n),c=t+a,f=i+u,x=1^r,y=r?n-o:o-n;if(s<0)throw new Error("negative radius: "+s);null===this._x1?this._+="M"+c+","+f:(Math.abs(this._x1-c)>1e-6||Math.abs(this._y1-f)>1e-6)&&(this._+="L"+c+","+f),s&&(y<0&&(y=y%_+_),y>e?this._+="A"+s+","+s+",0,1,"+x+","+(t-a)+","+(i-u)+"A"+s+","+s+",0,1,"+x+","+(this._x1=c)+","+(this._y1=f):y>1e-6&&(this._+="A"+s+","+s+",0,"+ +(y>=h)+","+x+","+(this._x1=t+s*Math.cos(o))+","+(this._y1=i+s*Math.sin(o))))},rect:function(t,i,s,h){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+i)+"h"+ +s+"v"+ +h+"h"+-s+"Z"},toString:function(){return this._}},t.path=s,Object.defineProperty(t,"__esModule",{value:!0})});