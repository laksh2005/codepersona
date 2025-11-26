// Minimal User model placeholder (no ORM).
class User {
  constructor({ id, username }) {
    this.id = id || null;
    this.username = username || '';
  }
}

module.exports = User;
