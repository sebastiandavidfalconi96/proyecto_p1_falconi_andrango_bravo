class UserDTO {
    constructor({ id, firstName, lastName, email, userType, status}) {
        this.id = id;
        this.fullName = `${firstName} ${lastName}`;
        this.email = email;
        this.userType = userType;
        this.status = status;
    }
}

// Builder para construir UserDTO
class UserDTOBuilder {
    constructor() {
        this.user = {};
    }

    setId(id) {
        this.user.id = id;
        return this;
    }

    setFirstName(firstName) {
        this.user.firstName = firstName;
        return this;
    }

    setLastName(lastName) {
        this.user.lastName = lastName;
        return this;
    }

    setEmail(email) {
        this.user.email = email;
        return this;
    }

    setUserType(userType) {
        this.user.userType = userType;
        return this;
    }

    setStatus(status) {
        this.user.status = status;
        return this;
    }

    build() {
        return new UserDTO(this.user);
    }
}

module.exports = { UserDTO, UserDTOBuilder };
