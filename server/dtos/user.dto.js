class UserDto{
    constructor({ _id, email, isActivated }) {
        this.id = _id;
        this.email = email;
        this.isActivated = isActivated;
    }
}

module.exports = UserDto;