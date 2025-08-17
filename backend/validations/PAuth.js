import {body} from 'express-validator'

export const authorValidator = [
    body(['author']).isLength({min:3 , max: 12})
]