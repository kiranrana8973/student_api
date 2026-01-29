const bcrypt = require('bcryptjs');
const IPasswordHasher = require('../../domain/services/IPasswordHasher');
class BcryptPasswordHasher extends IPasswordHasher {
  async hash(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async compare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}
module.exports = BcryptPasswordHasher;
