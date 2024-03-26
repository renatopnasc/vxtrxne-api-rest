import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileService } from "./get-user-profile";
import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      id: randomUUID(),
      name: "John Doe",
      email: "johndoe@exemple.com",
      password_hash: await hash("123123", 6),
      created_at: new Date()
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to get user profile with wrong ID', async () => {
    await expect(() => sut.execute({ userId: randomUUID() })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})