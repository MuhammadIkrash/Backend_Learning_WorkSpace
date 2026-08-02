import { body, validationResult } from "express-validator"

export const StudentValidation = [
    body("first_name").notEmpty().withMessage("First Name Must Required!")
        .trim()
        .isAlpha().withMessage("First Name Must in Alphabets!")
        .isLength({ min: 3 }).withMessage("First Name Must 3 Character Long!")
        .custom(value => {
            if (value === "MuhammadIKrash") {
                throw new Error('firstName with "Muhammad Ikrash" is not allow')
            }
            return true
        })
        .customSanitizer(value => {
           return value.charAt(0).toUpperCase() + value.slice(1);
        })
    ,
    body("last_name").notEmpty().withMessage("Last Name Must Required!")
        .trim()
        .isAlpha().withMessage("Last Name Must in Alphabets!")
        .isLength({ min: 3 }).withMessage("Last Name Must 3 Character Long!")
    ,
    body("email").notEmpty().withMessage("Email Must Required!")
        .trim()
        .isLength({ min: 10 }).withMessage("Email Must 3 Character Long!")
        .isEmail().withMessage("Valid Email Required!")
    ,
    body("phone").notEmpty().withMessage("Phone Number Must Required!")
        .trim()
        .isMobilePhone().withMessage("Phone Number only Accept Number"),
    body("address").trim(),
]