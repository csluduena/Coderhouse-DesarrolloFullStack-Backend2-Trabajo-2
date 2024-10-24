import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2'; //Github
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; //GoogleStrategy
import { config } from "dotenv";
import User from '../dao/models/user.model.js';
import Cart from '../dao/models/cart.model.js';
config();

const jwtSecret = process.env.JWT_SECRET;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const JWTOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: jwtSecret
};

const initializePassport = () => {
    passport.use("jwt", new JwtStrategy(JWTOptions, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.userId);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    // Estrategia de Github
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile._json.email });
            if (!user) {
                user = new User({
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: '',
                    age: 18,
                });
                await user.save();

                const newCart = new Cart({ user: user._id, items: [] });
                await newCart.save();

                user.cart = newCart._id;
                await user.save();
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia de Google
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Busca al usuario por el email proporcionado por Google
            let user = await User.findOne({ email: profile._json.email });

            if (!user) {
                // Si el usuario no existe, creamos un nuevo usuario usando Google como proveedor
                user = new User({
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    email: profile._json.email,
                    provider: 'google',  // Añadimos el proveedor como 'google'
                    // No establecemos una contraseña ya que es un usuario de Google
                    age: 18,  // Si la edad es requerida, puedes establecer un valor por defecto
                });
                await user.save();

                // Crear un carrito para el nuevo usuario
                const newCart = new Cart({ user: user._id, items: [] });
                await newCart.save();

                user.cart = newCart._id;
                await user.save();
            } else if (user.provider !== 'google') {
                // Si el usuario ya existe pero no se registró con Google, actualizamos el proveedor
                user.provider = 'google';
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serialización de usuario para la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialización de usuario
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
