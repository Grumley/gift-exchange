#!/usr/bin/env tsx

/**
 * Script to create an admin user
 * Usage: npm run create-admin
 * or: tsx scripts/create-admin.ts
 */

import { db } from '../db/database.js';
import { hashPassword } from '../utils/password.js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('=== Create Admin User ===\n');

  // Get user input
  const email = await question('Email: ');
  const name = await question('Name: ');
  const password = await question('Password: ');

  if (!email || !name || !password) {
    console.error('\nError: All fields are required');
    process.exit(1);
  }

  // Check if email already exists
  const existing = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email.toLowerCase());

  if (existing) {
    console.error(`\nError: User with email "${email}" already exists`);
    process.exit(1);
  }

  // Hash password
  console.log('\nHashing password...');
  const passwordHash = await hashPassword(password);

  // Insert admin user
  const result = db
    .prepare('INSERT INTO users (email, password_hash, name, is_admin) VALUES (?, ?, ?, 1)')
    .run(email.toLowerCase(), passwordHash, name);

  console.log('\n✓ Admin user created successfully!');
  console.log(`  ID: ${result.lastInsertRowid}`);
  console.log(`  Email: ${email}`);
  console.log(`  Name: ${name}`);
  console.log(`  Password: ${password}`);
  console.log('\nYou can now login with these credentials.\n');

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
