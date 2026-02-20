async function testFlow() {
    try {
        console.log('1. Testing login with /api/auth/login...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin' })
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status} - ${JSON.stringify(loginData)}`);
        }

        console.log('Login successful. Token obtained.');
        const token = loginData.data.token;

        console.log('2. Testing user list with /api/users...');
        const usersResponse = await fetch('http://localhost:3000/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const usersData = await usersResponse.json();

        if (usersResponse.ok) {
            console.log('User list fetch successful:', usersData);
        } else {
            console.error('User list fetch failed:', usersResponse.status, usersData);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testFlow();
