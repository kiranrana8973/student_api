/**
 * Not Found Exception
 */

const DomainException = require('./DomainException');

class NotFoundException extends DomainException {
  constructor(message) {
    super(message, 404);
  }
}

module.exports = NotFoundException;
