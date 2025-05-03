import dns from 'node:dns/promises';

export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) {
    return res.status(400).json({ error: "Missing domain parameter" });
  }

  const results = {};
  const recordTypes = ['A', 'AAAA', 'MX', 'NS', 'SOA', 'TXT', 'CNAME'];

  for (const type of recordTypes) {
    try {
      results[type] = await dns.resolve(domain, type);
    } catch (e) {
      results[type] = e.code || e.message;
    }
  }

  // DNSSEC placeholder
  results['DNSSEC'] = "Not implemented in this version";

  // Lightweight logging
  console.log(`[LOG] DNS check for: ${domain} at ${new Date().toISOString()}`);

  res.status(200).json(results);
}
