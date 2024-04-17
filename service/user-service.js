const bcrypt = require('bcrypt')
const uuid = require('uuid');
const ApiError = require("../exseptions/api-error");
const db = require("../db/db")
const UserDto = require("../dtos/user-dto");
const tokenService = require("../service/token-service")
class UserService{ 
    async registration(name, password){
        const candidate = await db.query('SELECT * FROM person where name = $1', [name])
        if(candidate.rows.length !== 0) throw ApiError.BadRequest(`Пользователь с таким username ${name} уже существует `);
        
        const hashPassword = await bcrypt.hash(password, 3)

        let user = await db.query(`Insert INTO person (name, password) values ($1, $2) RETURNING *`, [name, hashPassword])
        user = user.rows[0]

        const userDto = new UserDto(user);
        console.log(userDto)
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async login(name, password){
        let user = (await db.query('SELECT * FROM person WHERE name = $1', [name])).rows[0]
        if(!user) throw ApiError.BadRequest('Пользователь с таким username не найден');
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch)
        if(!passwordMatch)  throw ApiError.BadRequest('Неверный пароль')
        
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }


    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);

        return token;
    }


    async refresh(refreshToken){
        if(!refreshToken) throw ApiError.UnauthorizedError();

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        console.log('userData',userData)
        if(!userData || !tokenFromDb)  throw ApiError.UnauthorizedError();

        const user = (await db.query(`SELECT * from person where id = $1`,[userData.id])).rows[0];
        const userDto = new UserDto(user);
        console.log(userDto)
        
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto, }
    } 
    
   /* async checkPwd(name, password){
        const user = await db.query(`SELECT * FROM person WHERE name= $1;`, [name]);

        return await bcrypt.compare(pwd, user.pwd);
    }
*/
    /*async changePwd(email, password){
        const hashPassword = await bcrypt.hash(password, 3)

        const user = await db.query(`SELECT * FROM users WHERE email= $1;`, [email]);
        user.password = hashPassword
        await user.save()

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }*/
}

module.exports = new UserService()