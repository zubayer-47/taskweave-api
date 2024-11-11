import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create users
  await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          fullname: faker.person.fullName(),
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: '$2b$12$qMdY.IVBatUdDNNVxL2vxOShufXqP6JVih0J/xFPlYUkm/7TfZLsW',
          gender: 'MALE',
          // avatar: faker.image.avatar(),
          avatar: faker.image.avatar(),
          bio: faker.lorem.sentence(),
          isActive: faker.datatype.boolean()
        }
      })
    )
  )

  console.log('Inserted dummy users, communities, and members')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
