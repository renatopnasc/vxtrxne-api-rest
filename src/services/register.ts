import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { hash } from 'bcryptjs'
import { DifferentPasswordError } from "./errors/different-password-error"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ name, email, password, confirmPassword }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const doesPasswordsMatch = password === confirmPassword

    if (!doesPasswordsMatch) throw new DifferentPasswordError()

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({ name, email, password_hash })

    return { user }
  }
}
