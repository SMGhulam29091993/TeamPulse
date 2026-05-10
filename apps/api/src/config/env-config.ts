import dotenv from 'dotenv';

switch(process.env.NODE_ENV === 'development'){
    //use .env.development for development environment
    case true:
        dotenv.config({ path: '.env.development' });
        break;
    //use .env for production environment
    default:
        dotenv.config({ path: '.env' });
        break;
}

export const config =  {
    port : Number.isFinite(Number(process.env.PORT)) ? Number(process.env.PORT) :  3000,
    host : process.env.HOST as string ?? 'localhost',
}

