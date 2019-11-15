const url = 'http://localhost:3000';

const paths = {
    LOGIN: `${url}/api/login`,
    LOGOUT: `${url}/api/logout`,
    USERS: `${url}/api/users`,
    ROLES: `${url}/api/roles`,
    CATEGORIES: `${url}/api/categories`,
    PRODUCTS: `${url}/api/products`,
}

export function getSessionToken() {
    return localStorage.getItem('session-token');
}

export function setSessionToken(token) {
    localStorage.setItem('session-token', token);
}

export function login(data) {
    const body = JSON.stringify({ login: data.login, password: data.password });

    return fetch(paths.LOGIN, {
        body,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => {
        const sessionToken = res.headers.get('session-token');

        if (sessionToken) {
            setSessionToken(sessionToken);
        }

        return res.status === 200;
    });
}

export function getUserRole(id) {
    return fetch(paths.ROLES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'session-token': getSessionToken()
        },
    })
    .then(body => body.json())
    .then(roles => roles.find(x => x.id === id))
    .then(role => role ? role.name : null);
}

export function getUserData(login) {
    return fetch(paths.USERS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'session-token': getSessionToken()
        },
    })
    .then(body => body.json())
    .then(users => users.find(x => x.login === login))
    .then(user => {
        if (!user) return;

        return getUserRole(user.id).then(name => ({...user, role: name}));
    });
}

export function checkAuthStatus() {
    return fetch(paths.USERS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'session-token': getSessionToken()
        },
    }).then(res => res.status === 200);
}