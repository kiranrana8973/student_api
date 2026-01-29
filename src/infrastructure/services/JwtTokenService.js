const jwt = require('jsonwebtoken');
const ITokenService = require('../../domain/services/ITokenService');
class JwtTokenService extends ITokenService {
  constructor(secret, expiresIn) {
    super();
    this.secret = secret;
    this.expiresIn = expiresIn;
  }
  generateToken(studentId) {
    return jwt.sign({ id: studentId }, this.secret, {
      expiresIn: this.expiresIn,
    });
  }
  verifyToken(token) {
    return jwt.verify(token, this.secret);
  }
}
module.exports = JwtTokenService;
