
import { db } from '../db/database.js';
import { hashPassword } from '../utils/password.js';

async function main() {
    const email = 'admin@test.com';
    const name = 'Admin User';
    const password = 'password123';

    console.log(`Creating/Updating admin: ${email}`);

    // Check existence
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    const passwordHash = await hashPassword(password);

    if (existing) {
        console.log('User exists, updating password...');
        db.prepare('UPDATE users SET password_hash = ?, is_admin = 1 WHERE email = ?')
            .run(passwordHash, email);
    } else {
        console.log('User does not exist, creating...');
        db.prepare('INSERT INTO users (email, password_hash, name, is_admin) VALUES (?, ?, ?, 1)')
            .run(email, passwordHash, name);
    }
    console.log('Done.');
}

main();
