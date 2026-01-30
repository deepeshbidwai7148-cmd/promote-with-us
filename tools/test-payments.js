// Simple end-to-end test for the payments flow
// Requires: Node 18+ (global fetch). Run: node tools/test-payments.js [leadId]

const fs = require('fs');
const path = require('path');
const leadId = process.argv[2] || '1';
const base = 'http://127.0.0.1:3000';

async function run() {
  try {
    console.log('Starting payments E2E test for lead', leadId);

    const payload = {
      payment: {
        amount: 123.45,
        method: 'UPI',
        date: new Date().toISOString().slice(0,10),
        note: 'e2e-test',
        transactionId: 'E2ETXN' + Date.now(),
        // 1x1 PNG data URI (very small) to simulate screenshot attachment
        screenshotData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
      },
      totalAmount: 1500
    };

    const putRes = await fetch(`${base}/api/lead/${encodeURIComponent(leadId)}/payment`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).catch(err => { throw new Error('Network error while PUT: ' + err.message); });

    const putJson = await putRes.json().catch(() => null);
    console.log('PUT /api/lead/' + leadId + '/payment ->', putRes.status, putJson && putJson.success ? 'OK' : (putJson && putJson.message) || 'FAILED');
    console.log('Response body:', JSON.stringify(putJson, null, 2));

    const getRes = await fetch(`${base}/api/lead/${encodeURIComponent(leadId)}?t=${Date.now()}`);
    const getJson = await getRes.json();
    console.log('\nGET /api/lead/' + leadId + ' ->', getRes.status, getJson && getJson.success ? 'OK' : 'FAILED');
    console.log('Lead (summary):', JSON.stringify({ id: getJson.lead && getJson.lead.id, paidAmount: getJson.lead && getJson.lead.paidAmount, remainingAmount: getJson.lead && getJson.lead.remainingAmount, paymentsCount: (getJson.lead && getJson.lead.payments && getJson.lead.payments.length) || 0 }, null, 2));

    // Check leads.json on disk
    const leadsPath = path.resolve(__dirname, '..', 'leads.json');
    if (fs.existsSync(leadsPath)) {
      const raw = fs.readFileSync(leadsPath, 'utf8');
      const has = raw.indexOf('e2e-test') !== -1;
      console.log('\nleads.json contains test payment:', has ? 'YES' : 'NO (not persisted)');
    } else {
      console.log('\nCould not find leads.json at', leadsPath);
    }

    if (!putJson || !putJson.success) process.exitCode = 2;
  } catch (err) {
    console.error('E2E test failed:', err.message || err);
    process.exitCode = 1;
  }
}

run();
