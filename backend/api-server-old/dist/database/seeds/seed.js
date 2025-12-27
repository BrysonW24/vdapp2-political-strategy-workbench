"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    console.log('Clearing existing data...');
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: client_1.Role.ADMIN,
            isActive: true,
        },
    });
    console.log('✅ Created admin user:', admin.email);
    const userPassword = await bcrypt.hash('User123!', 10);
    const user1 = await prisma.user.create({
        data: {
            email: 'john.doe@example.com',
            password: userPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: client_1.Role.USER,
            isActive: true,
        },
    });
    console.log('✅ Created user:', user1.email);
    const user2 = await prisma.user.create({
        data: {
            email: 'jane.smith@example.com',
            password: userPassword,
            firstName: 'Jane',
            lastName: 'Smith',
            role: client_1.Role.USER,
            isActive: true,
        },
    });
    console.log('✅ Created user:', user2.email);
    const moderatorPassword = await bcrypt.hash('Mod123!', 10);
    const moderator = await prisma.user.create({
        data: {
            email: 'moderator@example.com',
            password: moderatorPassword,
            firstName: 'Mod',
            lastName: 'Erator',
            role: client_1.Role.MODERATOR,
            isActive: true,
        },
    });
    console.log('✅ Created moderator:', moderator.email);
    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Test Credentials:');
    console.log('━'.repeat(50));
    console.log('Admin:     admin@example.com / Admin123!');
    console.log('Moderator: moderator@example.com / Mod123!');
    console.log('User:      john.doe@example.com / User123!');
    console.log('User:      jane.smith@example.com / User123!');
    console.log('━'.repeat(50));
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map