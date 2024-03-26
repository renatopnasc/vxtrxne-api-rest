import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123123', 6),
      created_at: new Date(),
    })

    const { user } = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@exemple.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with worng password', async () => {
    await usersRepository.create({
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123123', 6),
      created_at: new Date(),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@exemple.com',
        password: '123123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
