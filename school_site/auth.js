const AuthSystem = {
    users: [],
    currentUser: null,

    init() {
        this.loadUsers();
        this.loadCurrentUser();
        this.updateUI();
    },

    loadUsers() {
        try {
            const stored = localStorage.getItem('school_users');
            if (stored) {
                this.users = JSON.parse(stored);
            } else {
                // Создаем тестовых пользователей
                this.users = [
                    {
                        id: 1,
                        name: "Директор школы",
                        email: "admin@school19.ru",
                        password: "admin123",
                        role: "admin",
                        registeredAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: "Иванова Мария Петровна",
                        email: "teacher@school19.ru",
                        password: "teacher123",
                        role: "teacher",
                        registeredAt: new Date().toISOString()
                    }
                ];
                localStorage.setItem('school_users', JSON.stringify(this.users));
            }
            console.log('Загружено пользователей:', this.users.length);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            this.users = [];
        }
    },

    loadCurrentUser() {
        try {
            const stored = localStorage.getItem('current_user');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Ошибка загрузки текущего пользователя:', error);
            this.currentUser = null;
        }
    },

    register(userData) {
        // Проверяем, есть ли уже пользователь с таким email
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'Пользователь с таким email уже существует' };
        }

        // Создаем нового пользователя
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            registeredAt: new Date().toISOString()
        };

        // Добавляем пользователя в массив
        this.users.push(newUser);

        // Сохраняем в localStorage
        localStorage.setItem('school_users', JSON.stringify(this.users));

        return { success: true, message: 'Регистрация успешна!' };
    },

    login(email, password) {
        console.log('Попытка входа:', email);
        console.log('Доступные пользователи:', this.users);

        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('current_user', JSON.stringify(user));
            this.updateUI();
            console.log('Успешный вход:', user);
            return { success: true, message: 'Вход выполнен!' };
        } else {
            console.log('Ошибка входа: неверные данные');
            return { success: false, message: 'Неверный email или пароль' };
        }
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
        this.updateUI();
        window.location.href = 'index.html';
    },

    updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');

        if (!authButtons || !userMenu) return;

        if (this.currentUser) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    },

    isTeacher() {
        return this.currentUser && this.currentUser.role === 'teacher';
    },

    isStudent() {
        return this.currentUser && this.currentUser.role === 'student';
    },

    isParent() {
        return this.currentUser && this.currentUser.role === 'parent';
    },

    // Добавляем метод для получения всех пользователей
    getAllUsers() {
        return this.users;
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    AuthSystem.init();
});
