import { beforeEach, describe, expect, it } from "vitest"
import { RegisterService } from "./register"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { DifferentPasswordError } from "./errors/different-password-error"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { compare } from "bcryptjs"

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@exemple.com",
      password: "123123",
      confirmPassword: "123123"
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register with different password', async () => {
    await expect(() => sut.execute({
      name: "John Doe",
      email: "johndoe@exemple.com",
      password: "123123",
      confirmPassword: "1231234"
    })).rejects.toBeInstanceOf(DifferentPasswordError)
  })

  it('should not be able to register with the email already registered', async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@exemple.com",
      password: "123123",
      confirmPassword: "123123"
    })

    await expect(() => sut.execute({
      name: "John Doe",
      email: "johndoe@exemple.com",
      password: "123123",
      confirmPassword: "123123"
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should hash the password upon registration', async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@exemple.com",
      password: "123123",
      confirmPassword: "123123"
    })

    const isPasswordCorrectlyHashed = await compare("123123", user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})