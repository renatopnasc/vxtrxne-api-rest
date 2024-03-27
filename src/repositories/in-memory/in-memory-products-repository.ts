import { Prisma, Product } from '@prisma/client'
import { ProductsRepository } from '../products-repository'
import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      price: new Decimal(data.price as string),
      user_id: data.user_id,
      category_id: data.category_id,
      created_at: new Date(),
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
    }

    this.items.push(product)

    return product
  }
}
