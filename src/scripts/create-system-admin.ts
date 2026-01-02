import sequelize from "../config/db";
import User from "../models/User.model";
import Role from "../models/Role.model";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, resolve));

const createSystemAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established.");

        console.log("\n--- Create System Admin ---\n");

        const firstName = await question("First Name: ");
        const lastName = await question("Last Name: ");
        const email = await question("Email: ");
        const username = await question("Username (optional, enter to auto-gen): ");
        const password = await question("Password (default '123456'): ") || "123456";
        const phone = await question("Phone Number (optional): ");
        const genderInput = await question("Gender (Male/Female, default: Male): ");
        const gender = (genderInput && genderInput.toLowerCase() === 'female') ? 'Female' : 'Male';

        // 1. Find or create SystemAdmin role
        let systemAdminRole = await Role.findOne({ where: { name: "SystemAdmin" } });
        if (!systemAdminRole) {
            console.log("SystemAdmin role not found. Creating it...");
            systemAdminRole = await Role.create({
                name: "SystemAdmin",
                permissions: null,
                orgId: null
            });
            console.log("SystemAdmin role created.");
        }

        // 3. Auto-gen username if needed
        let finalUsername = username;
        if (!finalUsername || finalUsername.trim() === "") {
            const randomNumber = Math.floor(1000 + Math.random() * 9000);
            finalUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}`;
        }

        // 4. Create user
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(),
            username: finalUsername.toLowerCase(),
            password, // Plain text, model hook hashes it
            phone: phone || null,
            gender,
            role_id: systemAdminRole.id,
            orgId: null, // SystemAdmin is global
            status: "Active",
            isStricted: false
        } as any);

        console.log(`\nSystem Admin created successfully! ID: ${user.id}`);
        process.exit(0);
    } catch (error) {
        console.error("Failed to create System Admin:", error);
        process.exit(1);
    }
};

createSystemAdmin();
