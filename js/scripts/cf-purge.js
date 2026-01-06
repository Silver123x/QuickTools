const token = process.env.CF_API_TOKEN;
const zoneId = process.env.CF_ZONE_ID;
if(!token || !zoneId){
  console.error('CF_API_TOKEN and CF_ZONE_ID required');
  process.exit(1);
}
const body = { purge_everything: true };
const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});
const json = await res.json();
if(json.success){
  console.log('Cache purged successfully');
} else {
  console.error('Cache purge failed', json.errors);
  process.exit(1);
}
