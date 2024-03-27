import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateProductService } from './create-product'
import { randomUUID } from 'crypto'

let productsRepository: InMemoryProductsRepository
let sut: CreateProductService

describe('Create Product Service', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    sut = new CreateProductService(productsRepository)
  })

  it('should be able to create a product', async () => {
    const { product } = await sut.execute({
      title: 'iPhone 15 Pro Max',
      description: 'asdasdasdadad',
      price: 7800,
      userId: randomUUID(),
      categoryId: randomUUID(),
    })

    expect(product.id).toEqual(expect.any(String))
  })
})
