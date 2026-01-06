export function levenshtein(a: string, b: string): number {
  const m=a.length, n=b.length;
  const dp = Array.from({length:m+1}, ()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++) dp[i][0]=i;
  for(let j=0;j<=n;j++) dp[0][j]=j;
  for(let i=1;i<=m;i++){
    for(let j=1;j<=n;j++){
      const cost = a[i-1]===b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i-1][j]+1,
        dp[i][j-1]+1,
        dp[i-1][j-1]+cost
      );
    }
  }
  return dp[m][n];
}
export function jaccardSimilarity(a: string, b: string): number {
  function tokens(s:string){ return (s.toLowerCase().match(/[a-z0-9]+/g) || []); }
  const sa=new Set(tokens(a)), sb=new Set(tokens(b));
  const inter = new Set([...sa].filter(x=>sb.has(x)));
  const union = new Set([...sa, ...sb]);
  return union.size ? inter.size/union.size : 1;
}
export function stableComparator(a: string, b: string, numeric=false, caseSensitive=false): number {
  let aa=a, bb=b;
  if(!caseSensitive){ aa=aa.toLowerCase(); bb=bb.toLowerCase(); }
  if(numeric){
    const na=Number(aa), nb=Number(bb);
    if(!Number.isNaN(na) && !Number.isNaN(nb)){
      if(na<nb) return -1;
      if(na>nb) return 1;
      return 0;
    }
  }
  return aa.localeCompare(bb);
}
