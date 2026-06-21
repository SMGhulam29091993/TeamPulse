import { config } from '../../config/env-config';

export const cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: (config.nodeEnv === 'production' ? 'strict' : 'lax') as
        | 'strict'
        | 'lax',
    maxAge: config.refreshMaxAge,
};
