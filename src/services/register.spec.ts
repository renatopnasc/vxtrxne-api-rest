import { beforeEach, describe, expect, it } from "vitest"
import { RegisterService } from "./register"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register', () => {
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
})