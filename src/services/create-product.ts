import { ProductsRepository } from '@/repositories/products-repository'
import { Product } from '@prisma/client'

interface CreateProductServiceRequest {
  title: string
  description: string
  price: number
  userId: string
  categoryId: string
  updated_at?: Date
}

interface CreateProductServiceResponse {
  product: Product
}

export class CreateProductService {
  // eslint-disable-next-line prettier/prettier
  constructor(private productsRepository: ProductsRepository) { }

  async execute({
    title,
    description,
    price,
    userId,
    categoryId,
    updated_at,
  }: CreateProductServiceRequest): Promise<CreateProductServiceResponse> {
    const product = await this.productsRepository.create({
      title,
      description,
      price,
      user_id: userId,
      category_id: categoryId,
      updated_at: updated_at ? new Date() : null,
    })

    return { product }
  }
}
