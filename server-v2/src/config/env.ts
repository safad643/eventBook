import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
    PORT: Joi.number().default(5000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    MONGO_URI: Joi.string().uri().required().messages({
        'string.empty': 'MONGO_URI is required',
        'any.required': 'MONGO_URI is required',
    }),
    JWT_SECRET: Joi.string().min(1).required().messages({
        'string.empty': 'JWT_SECRET is required',
        'any.required': 'JWT_SECRET is required',
    }),
    JWT_EXPIRE: Joi.string().default('7d'),
    CLIENT_URL: Joi.string().uri().default('http://localhost:5173'),
    CLOUDINARY_CLOUD_NAME: Joi.string().required().messages({
        'string.empty': 'CLOUDINARY_CLOUD_NAME is required',
        'any.required': 'CLOUDINARY_CLOUD_NAME is required',
    }),
    CLOUDINARY_API_KEY: Joi.string().required().messages({
        'string.empty': 'CLOUDINARY_API_KEY is required',
        'any.required': 'CLOUDINARY_API_KEY is required',
    }),
    CLOUDINARY_API_SECRET: Joi.string().required().messages({
        'string.empty': 'CLOUDINARY_API_SECRET is required',
        'any.required': 'CLOUDINARY_API_SECRET is required',
    }),
    EMAIL_USER: Joi.string().email().required().messages({
        'string.empty': 'EMAIL_USER is required',
        'any.required': 'EMAIL_USER is required',
    }),
    EMAIL_PASS: Joi.string().required().messages({
        'string.empty': 'EMAIL_PASS is required',
        'any.required': 'EMAIL_PASS is required',
    }),
})
    .unknown(true)
    .options({ stripUnknown: true });

function validateEnv(): {
    PORT: number;
    NODE_ENV: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    CLIENT_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
} {
    const raw = {
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        NODE_ENV: process.env.NODE_ENV,
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRE: process.env.JWT_EXPIRE,
        CLIENT_URL: process.env.CLIENT_URL,
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
    };

    const { error, value } = envSchema.validate(raw, { abortEarly: false });

    if (error) {
        const messages = error.details.map((d) => `  - ${d.path.join('.')}: ${d.message}`).join('\n');
        throw new Error(`Invalid environment configuration:\n${messages}`);
    }

    return value as ReturnType<typeof validateEnv>;
}

export const env = validateEnv();
