import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      isActive: true,
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create regular users
  const userPassword = await bcrypt.hash('User123!', 10)

  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
      isActive: true,
    },
  })
  console.log('✅ Created user:', user1.email)

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: userPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: Role.USER,
      isActive: true,
    },
  })
  console.log('✅ Created user:', user2.email)

  // Create moderator
  const moderatorPassword = await bcrypt.hash('Mod123!', 10)
  const moderator = await prisma.user.create({
    data: {
      email: 'moderator@example.com',
      password: moderatorPassword,
      firstName: 'Mod',
      lastName: 'Erator',
      role: Role.MODERATOR,
      isActive: true,
    },
  })
  console.log('✅ Created moderator:', moderator.email)

  console.log('')
  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('Test Credentials:')
  console.log('━'.repeat(50))
  console.log('Admin:     admin@example.com / Admin123!')
  console.log('Moderator: moderator@example.com / Mod123!')
  console.log('User:      john.doe@example.com / User123!')
  console.log('User:      jane.smith@example.com / User123!')
  console.log('━'.repeat(50))
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
