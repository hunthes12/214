class Database {
    constructor() {
        this.users = [];
        this.loadUsersFromTxt();
    }

    async loadUsersFromTxt() {
        try {
            const response = await fetch('users.txt');
            const text = await response.text();
            this.parseUsersFromText(text);
        } catch (error) {
            console.log('Не удалось загрузить users.txt, используем стандартных пользователей');
            this.createDefaultUsers();
        }
    }

    parseUsersFromText(text) {
        const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));

        this.users = lines.map(line => {
            const [id, name, email, password, role, date] = line.split('|');
            return {
                id: parseInt(id),
                               name: name.trim(),
                               email: email.trim(),
                               password: password.trim(),
                               role: role.trim(),
                               registeredAt: date ? date.trim() : new Date().toISOString()
            };
        });

        localStorage.setItem('school_users', JSON.stringify(this.users));
    }

    createDefaultUsers() {
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

    getAllUsers() {
        return this.users;
    }

    findUser(email, password) {
        return this.users.find(u => u.email === email && u.password === password);
    }
}

const database = new Database();
