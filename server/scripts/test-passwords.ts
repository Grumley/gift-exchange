
import { generatePassword } from '../utils/password.js';

console.log('Generating 5 sample passwords:');
for (let i = 0; i < 5; i++) {
    console.log(generatePassword());
}
