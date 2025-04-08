document.addEventListener('DOMContentLoaded', function() {
    // Register Form
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                username: this.username.value,
                email: this.email.value,
                password: this.password.value,
                password2: this.password2.value
            };
            
            fetch('/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('registerResult');
                if (data.access) {
                    resultDiv.innerHTML = `
                        <div class="alert alert-success">
                            <p>Registration successful! Token received.</p>
                            <p>Access Token: <span class="token-display">${data.access}</span></p>
                            <a href="/ui/protected/" class="btn btn-success">Go to Protected Page</a>
                        </div>
                    `;
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                } else {
                    resultDiv.innerHTML = `
                        <div class="alert alert-danger">
                            ${JSON.stringify(data)}
                        </div>
                    `;
                }
            });
        });
    }

    // Login Form
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                username: this.username.value,
                password: this.password.value
            };
            
            fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('loginResult');
                if (data.access) {
                    resultDiv.innerHTML = `
                        <div class="alert alert-success">
                            <p>Login successful! Token received.</p>
                            <p>Access Token: <span class="token-display">${data.access}</span></p>
                            <a href="/ui/protected/" class="btn btn-success">Go to Protected Page</a>
                        </div>
                    `;
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                } else {
                    resultDiv.innerHTML = `
                        <div class="alert alert-danger">
                            ${JSON.stringify(data)}
                        </div>
                    `;
                }
            });
        });
    }

    // Protected Page
    if (document.getElementById('messageForm')) {
        // Load existing message
        const token = localStorage.getItem('access_token');
        if (token) {
            fetch('/api/auth/protected/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('messageInput').value = data.message;
                document.getElementById('userInfo').innerHTML = `
                    <div class="alert alert-info">
                        <p>Welcome, ${data.user.username}!</p>
                        <p>Last updated: ${new Date(data.updated_at).toLocaleString()}</p>
                    </div>
                `;
            });

            // Handle message submission
            document.getElementById('messageForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const message = document.getElementById('messageInput').value;
                
                fetch('/api/auth/protected/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: message })
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('messageResult').innerHTML = `
                        <div class="alert alert-success">
                            Message saved successfully!
                        </div>
                    `;
                })
                .catch(error => {
                    document.getElementById('messageResult').innerHTML = `
                        <div class="alert alert-danger">
                            Error saving message. Please try again.
                        </div>
                    `;
                });
            });

            // Logout button
            document.getElementById('logoutBtn').addEventListener('click', function() {
                const refreshToken = localStorage.getItem('refresh_token');
                fetch('/api/auth/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ refresh: refreshToken })
                })
                .then(() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/ui/login/';
                });
            });
        } else {
            window.location.href = '/ui/login/';
        }
    }
});