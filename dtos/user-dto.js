class UserDto{
    id;
    name;
    pwd;

    constructor(model){
        this.name = model.name;
        this.pwd= model.password;
        this.id = model.id;
    }
}
class FullUserDto{
    id;
    name;
    pwd;
    gender;
    birthday;
    location;
    summary;
    gitHub;
    linkedIn;
    twitter;

    constructor(model){
        this.id = model.id;
        this.name = model.name;
        this.pwd = model.pwd;
        this.gender = model.gender;
        this.birthday = model.birthday;
        this.location = model.location;
        this.summary = model.summary;
        this.gitHub = model.github;
        this.linkedIn = model.linkedIn;
        this.twitter = model.twitter;

    }
}

module.exports = {
    UserDto,
    FullUserDto,
};
