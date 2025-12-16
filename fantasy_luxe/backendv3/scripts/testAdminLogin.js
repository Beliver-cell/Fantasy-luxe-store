import fetch from 'node-fetch';

const run = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/user/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fantasyluxe.com', password: 'B7s@r9X!q4Fp' })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Request error:', err.message);
  }
}

run();
