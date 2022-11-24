export type str_num = number & string
export type todo = {
    userId: number
    id?: str_num
    title: string
    completed: boolean
}
