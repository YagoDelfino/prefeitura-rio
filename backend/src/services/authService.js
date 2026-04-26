const jwt = require("jsonwebtoken");

function generateToken(email) {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  const expiresIn = process.env.JWT_EXPIRES_IN || "8h";

  return jwt.sign(
    {
      preferred_username: email,
    },
    secret,
    { expiresIn }
  );
}

function login(request, response) {
  const { email, password } = request.body || {};

  if (email !== process.env.AUTH_EMAIL || password !== process.env.AUTH_PASSWORD) {
    return response.status(401).json({
      message: "Credenciais inválidas",
    });
  }

  const token = generateToken(email);

  return response.status(200).json({ token });
}

function authentication(request, response, next) {
    let token = '';

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return response.status(401).json({ message: 'Você não está autenticado' });
    }
    
    const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDetails) {
        return response.status(401).json({ message: 'Token inválido' });
    }

    if(tokenDetails.exp * 1000 < Date.now()) {
        return response.status(401).json({ message: 'Token expirado' });
    }

    return next();
}

module.exports = {
  authentication,
  login,
};