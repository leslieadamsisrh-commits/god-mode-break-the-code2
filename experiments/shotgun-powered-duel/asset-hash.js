// SHA-256 fallback for an HTTP development preview where Web Crypto is absent.
const primes=[];for(let n=2;primes.length<64;n++)if(!primes.some(p=>p*p<=n&&n%p===0))primes.push(n);
const frac=n=>(n%1*0x100000000)>>>0,K=primes.map(p=>frac(Math.cbrt(p))),H=primes.slice(0,8).map(p=>frac(Math.sqrt(p)));
const rotr=(v,n)=>(v>>>n)|(v<<(32-n));
export function sha256(input){const src=new Uint8Array(input),size=Math.ceil((src.length+9)/64)*64,bytes=new Uint8Array(size);bytes.set(src);bytes[src.length]=128;const view=new DataView(bytes.buffer);view.setUint32(size-8,Math.floor(src.length/0x20000000));view.setUint32(size-4,(src.length*8)>>>0);const hash=H.slice(),w=new Uint32Array(64);
 for(let off=0;off<size;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+i*4);for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2],s0=rotr(x,7)^rotr(x,18)^(x>>>3),s1=rotr(y,17)^rotr(y,19)^(y>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0}let[a,b,c,d,e,f,g,h]=hash;for(let i=0;i<64;i++){const s1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^(~e&g),t1=(h+s1+ch+K[i]+w[i])>>>0,s0=rotr(a,2)^rotr(a,13)^rotr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0}for(const [i,v]of[a,b,c,d,e,f,g,h].entries())hash[i]=(hash[i]+v)>>>0}
 return hash.map(v=>v.toString(16).padStart(8,'0')).join('');}
