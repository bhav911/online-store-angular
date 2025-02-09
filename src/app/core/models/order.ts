export interface Order {
    _id: string,
    user: {
        userId: string,
        username: string
    },
    products: {
        product: {
            _id: string,
            title: string,
            price: number
        }
        quantity: number
    }[]
}