/**
 * Test script to reproduce the JSON error.
 * Case 1: Correct JSON with Content-Type: application/json (Should pass)
 * Case 2: Correct JSON but missing/wrong Content-Type (Should fail if express.json() is strict)
 */

async function testJsonIssues() {
    const payload = JSON.stringify({ username: 'admin', password: 'admin' });

    console.log('--- Test 1: JSON with Content-Type: application/json ---');
    try {
        const res1 = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });
        const data1 = await res1.json();
        console.log(`Status: ${res1.status}, Msg: ${data1.message}`);
    } catch (e) { console.error(e.message); }

    console.log('\n--- Test 2: JSON provided but NO Content-Type (Simulating Raw->Text in Postman) ---');
    try {
        const res2 = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            // No headers
            body: payload
        });
        // Note: fetch might add text/plain or similar if body is string and no header
        const data2 = await res2.json();
        console.log(`Status: ${res2.status}`);
        console.log('Response:', data2);

        if (res2.status === 400 && data2.message === 'Username dan password wajib diisi') {
            console.log('>>> REPRODUCTION SUCCESSFUL: Missing Content-Type header causes failure.');
        }
    } catch (e) { console.error(e.message); }
}

testJsonIssues();
