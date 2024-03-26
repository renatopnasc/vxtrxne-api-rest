export class DifferentPasswordError extends Error {
  constructor() {
    super('Different Password.')
  }
}