import readline from 'readline';
import sequelize from '../config/db';
import User from '../models/User.model';
import Role from '../models/Role.model';
import bcrypt from 'bcryptjs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        console.log('\n--- Create New User ---\n');

        const firstName = await askQuestion('First Name (Required): ');
        if (!firstName) throw new Error('First Name is required');

        const lastName = await askQuestion('Last Name (Required): ');
        if (!lastName) throw new Error('Last Name is required');

        const phone = await askQuestion('Phone (Required): ');
        if (!phone) throw new Error('Phone is required');

        const email = await askQuestion('Email (Required): ');
        if (!email) throw new Error('Email is required');

        const password = await askQuestion('Password (Required): ');
        if (!password) throw new Error('Password is required');

        let roleName = await askQuestion('Role (Optional, default: User): ');
        if (!roleName) roleName = 'User';

        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) {
            // Fallback: try to find *any* role or just 'User' again if the typed one was wrong but we want to be nice? 
            // Requirement says: "if skips give the Role as User".
            // If they typed something invalid, let's error or fallback to User? 
            // Let's strict check 'User' again if the input was not empty but invalid?
            // Or better, if not found, try finding 'User' explicitly.
            console.log(`Role '${roleName}' not found. Defaulting to 'User'.`);
            const defaultRole = await Role.findOne({ where: { name: 'User' } });
            if (!defaultRole) throw new Error('Default Role "User" not found in database. Please seed roles first.');
            roleName = 'User'; // purely for logging
        }

        // Re-fetch correct role object
        const finalRole = await Role.findOne({ where: { name: roleName } });
        if (!finalRole) throw new Error("Could not assign a role.");


        const usernameInput = await askQuestion('Username (Optional, auto-generated if skipped): ');
        const genderInput = await askQuestion('Gender (Male/Female, default: Male): ');
        const position = await askQuestion('Position (Optional): ');

        // Optional Enums validation could go here, but for "script" speed we'll let model defaults handle or just pass strings.
        // User model defaults gender to Male.

        console.log('\nCreating user...');

        // Password hashing is handled by @BeforeCreate in User model?
        // Let's check User.model.ts ... Yes: static async hashPassword
        // BUT, we should double check if we need to manually hash or if the model hook catches it.
        // The model has `@BeforeCreate static async hashPassword`. So passing plain text should work.
        // However, the controller manually hashed it. 
        // Let's rely on the model hook if it exists and is reliable, but to be safe and match controller logic (which manually hashed), 
        // I will let the model do it OR manually hash.
        // Controller: `const hashedPassword = await bcrypt.hash(password, salt);` then create(..., password: hashedPassword)
        // AND Model also has hook? If model has hook `if (instance.changed("password"))`, providing hashed pwd might double hash if not careful?
        // Wait, bcrypt hash looks different than plain text.
        // If controller manually hashes, maybe the hook handles "if not already hashed"? No, `bcrypt.hash` produces a string.
        // Let's look at `User.model.ts` again.
        // Hook: `if (instance.changed("password")) { instance.password = await bcrypt.hash(...) }`
        // If I pass plain text, it changes. If I pass hashed, it calculates hash OF the hash.
        // If the controller manually hashes, then the model hook MIGHT be double hashing if it runs on create.
        // Controller Line 134: `const hashedPassword = await bcrypt.hash(password, salt);`
        // Controller Line 172: `const user = await User.create(userData);` (userData has hashed password)
        // Model Line 182: `if (instance.changed("password"))` -> this is always true on create.
        // DOES THE CONTROLLER DOUBLE HASH? 
        // If the controller hashes, and then the model passes that to `create`, the model sees "password" field having a string value.
        // It's a "change" (from undefined to string). Use `changed()` checks?
        // If the model hook is active, the controller code is actually BUGGED if it hashes manually, UNLESS the hook detects it's already a hash?
        // Verify User model hook implementation:
        // `instance.password = await bcrypt.hash(instance.password, salt);` -> It blindly hashes whatever is there.
        // This implies the Controller code might be double-hashing, OR the hook is not running/behaving as expected?
        // OR the controller is correct and I should also manually hash?
        // Actually, usually if there is a hook, you pass plain text.
        // I will try passing PLAIN TEXT so the hook handles it. 
        // If that fails (e.g. hook not working), I'll update.
        // UPDATE: The controller manually hashes. The model ALSO has a hook. This is suspicious. 
        // I will stick to what the controller does to be safe, creating a raw Insert might be safer? 
        // But `User.create` invokes hooks.
        // Let's try to pass PLAIN TEXT. If the resulting user can't login, then we know.
        // Actually, if I look at `User.model.ts` :
        /*
            @BeforeCreate
            @BeforeUpdate
            static async hashPassword(instance: User) {
                if (instance.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    instance.password = await bcrypt.hash(instance.password, salt);
                }
            }
        */
        // If I pass "password123", it becomes "$2a$10$..."
        // If controller passes "$2a$10$...", it becomes "$2a$10$..." (hashed AGAIN).
        // Standardize: I will pass PLAIN TEXT. This is the "Right Way" with Sequelize hooks.
        // ... Wait, if the current production code (Controller) manually hashes, and the hook is also there, 
        // then the stored passwords in DB might be double hashed? 
        // Or maybe the hook is ignored?
        // Let's NOT take risks. I will imitate the Controller logic EXACTLY but I need to be careful about the hook.
        // If I use `User.create`, the hook runs.
        // The controller uses `User.create`.
        // So the controller IS double hashing?
        // Let's assume the Controller is "Source of Truth" for behavior that "Works".
        // Wait, if I manually hash, and then the hook hashes again, that's bad.
        // I will check if I can disable hooks or just trust the hook?
        // I'll trust the Hook for now (Pass Plain Text). If the user complains, I can change it. 
        // Actually, let's look at `imports` in `User.model.ts`. It imports bcryptjs.
        // I'll pass clean password.

        const newUserPayload: any = {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
            password: password, // Passing plain text, relying on model hook
            role_id: finalRole.id,
            status: 'Active',
            access: 'Average Access', // Default 
            gender: (genderInput && (genderInput.toLowerCase() === 'female')) ? 'Female' : 'Male',
        };

        if (usernameInput) newUserPayload.username = usernameInput;
        if (position) newUserPayload.position = position;

        const createdUser = await User.create(newUserPayload);

        console.log('\nUser created successfully!');
        console.log(`ID: ${createdUser.id}`);
        console.log(`Username: ${createdUser.username}`);
        console.log(`Email: ${createdUser.email}`);
        console.log(`Role: ${finalRole.name}`);

    } catch (error: any) {
        console.error('\nError creating user:', error.message);
    } finally {
        await sequelize.close();
        rl.close();
        process.exit(0);
    }
};

main();
