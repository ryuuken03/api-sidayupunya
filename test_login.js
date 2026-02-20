async function testLogin() {
    try {
        console.log('Testing login with /api/auth/login...');
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful:', data);
        } else {
            console.error('Login failed with status:', response.status);
            console.error('Data:', data);
        }
    } catch (error) {
        console.error('Login failed:', error.message);
    }
}

testLogin();
