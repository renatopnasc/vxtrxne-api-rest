import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { hash } from 'bcryptjs'

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
    const doesPassowrdsMatch = password === confirmPassword

    // TODO: create an Error to diffenrents passwords
    if (!doesPassowrdsMatch) throw new Error('Passwords dont match')

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    // TODO: create an Error for existing user
    if (userWithSameEmail) throw new Error('User already exists.')

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({ name, email, password_hash })

    return { user }
  }
}
