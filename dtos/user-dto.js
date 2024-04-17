module.exports = class UserDto{
    name;
    pwd;
    id;

    constructor(model){
        this.name = model.name;
        this.pwd= model.password;
        this.id = model.id;
    }
}