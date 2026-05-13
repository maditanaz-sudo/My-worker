const PSK = "helloworld";

const STRIP_HEADERS = new Set(["host","connection","content-length","transfer-encoding","proxy-connection","proxy-authorization","x-forwarded-for","x-forwarded-host","x-forwarded-proto","x-forwarded-port","x-real-ip","forwarded","via","x-mhr-hop","accept-encoding"]);

function decodeBase64ToBytes(input){
const bin=atob(input);
const out=new Uint8Array(bin.length);
for(let i=0;
i<bin.length;
i++)out[i]=bin.charCodeAt(i);
return out;
}

function encodeBytesToBase64(bytes){
let bin="";
for(let i=0;
i<bytes.length;
i++)bin+=String.fromCharCode(bytes[i]);
return btoa(bin);
}

function sanitizeHeaders(h){
const out={
}
;
if(!h||typeof h!=="object")return out;
for(const[k,v]of Object.entries(h)){
if(!k)continue;
if(STRIP_HEADERS.has(k.toLowerCase()))continue;
out[k]=String(v??"");
}
return out;
}

async function handleRequest(req){
try{
if(req.method==="GET"){
return new Response(JSON.stringify({
ok:true,status:"healthy",message:"Everything is OK.",usage:"Send POST for proxy."}
),{
status:200,headers:{
"Content-Type":"application/json"}
}
);
}
if(req.method!=="POST"){
return new Response(JSON.stringify({
e:"method_not_allowed"}
),{
status:405,headers:{
"Content-Type":"application/json"}
}
);
}
const body=await req.json();
if(!body||typeof body!=="object"){
return new Response(JSON.stringify({
e:"bad_json"}
),{
status:400,headers:{
"Content-Type":"application/json"}
}
);
}
const k=String(body.k??"");
const u=String(body.u??"");
const m=String(body.m??"GET").toUpperCase();
const h=sanitizeHeaders(body.h);
const b64=body.b;
if(k!==PSK)return new Response(JSON.stringify({
e:"unauthorized"}
),{
status:401,headers:{
"Content-Type":"application/json"}
}
);
if(!/^https?:\/\//i.test(u))return new Response(JSON.stringify({
e:"bad_url"}
),{
status:400,headers:{
"Content-Type":"application/json"}
}
);
try{
const targetHost=new URL(u).hostname.toLowerCase();
const workerHost=new URL(req.url).hostname.toLowerCase();
if(targetHost===workerHost){
return new Response(JSON.stringify({
e:"loop_detected"}
),{
status:508,headers:{
"Content-Type":"application/json"}
}
);
}
}
catch(_){
}
const hopHeader=req.headers.get("x-mhr-hop");
if(hopHeader&&/\/macros\/s\//i.test(u)){
return new Response(JSON.stringify({
e:"loop_detected"}
),{
status:508,headers:{
"Content-Type":"application/json"}
}
);
}
let payload;
if(typeof b64==="string"&&b64.length>0)payload=decodeBase64ToBytes(b64);
const requestBody=payload?Uint8Array.from(payload):undefined;
const resp=await fetch(u,{
method:m,headers:h,body:requestBody,redirect:"manual"}
);
const data=new Uint8Array(await resp.arrayBuffer());
const respHeaders={
}
;
resp.headers.forEach((value,key)=>{
respHeaders[key]=value;
}
);
return new Response(JSON.stringify({
s:resp.status,h:respHeaders,b:encodeBytesToBase64(data)}
),{
headers:{
"Content-Type":"application/json"}
}
);
}
catch(err){
return new Response(JSON.stringify({
e:err.message}
),{
status:500,headers:{
"Content-Type":"application/json"}
}
);
}
}

addEventListener("fetch",event=>{
event.respondWith(handleRequest(event.request));
}
);
