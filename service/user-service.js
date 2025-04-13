const bcrypt = require('bcrypt')
const ApiError = require("../exseptions/api-error");
const db = require("../db/db")
const {UserDto, FullUserDto} = require("../dtos/user-dto");
const tokenService = require("../service/token-service")
class UserService{
    async registration(name, password) {
        const [candidate] = await db.query('SELECT * FROM person WHERE name = ?', [name]);
        if (candidate.length !== 0) throw ApiError.BadRequest(`Пользователь с таким username ${name} уже существует`);

        const hashPassword = await bcrypt.hash(password, 3);

        // Insert the user and retrieve the last inserted ID
        const [result] = await db.query('INSERT INTO person (name, password) VALUES (?, ?)', [name, hashPassword]);
        const userId = result.insertId; // Get the ID of the newly inserted user

        // Now retrieve the user from the database
        const [user] = await db.query('SELECT * FROM person WHERE id = ?', [userId]);

        const userDto = new UserDto(user[0]);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async login(name, password) {
        const [userRows] = await db.query('SELECT * FROM person WHERE name = ?', [name]);
        const user = userRows[0];
        if (!user) throw ApiError.BadRequest('Пользователь с таким username не найден');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw ApiError.BadRequest('Неверный пароль');

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError();

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();

        const [userRows] = await db.query('SELECT * FROM person WHERE id = ?', [userData.id]);
        const user = userRows[0];
        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async getUser(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError();

        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!userData) throw ApiError.UnauthorizedError();

        const [userRows] = await db.query('SELECT * FROM person WHERE id = ?', [userData.id]);
        const user = userRows[0];
        const fullUserDto = new FullUserDto(user);
        return { user: fullUserDto };
    }

    async update(newDataUser) {
        try {
            const { id, ...fieldToUpdate } = newDataUser;
            const field = Object.keys(fieldToUpdate)[0];
            let value = fieldToUpdate[field];

            const query = {
                sql: `UPDATE person SET ${field} = ? WHERE id = ?`,
                values: [value, id]
            };
            await db.query(query);

            const [userRows] = await db.query('SELECT * FROM person WHERE id = ?', [id]);

            const fullUserDto = new FullUserDto(userRows[0]);
            return { user: fullUserDto };
        } catch (error) {
            console.error(error);
        }
    }

    async getUserById(userId) {
        const [userRows] = await db.query('SELECT * FROM person WHERE id = ?', [userId]);
        const user = userRows[0];
        const fullUserDto = new FullUserDto(user);
        return { user: fullUserDto };
    }


    async changePwd(id, pwd, newPwd){
        const [userRows] = await db.query(`SELECT * FROM person WHERE id = ?;`, [id]);
        const user = userRows[0];

        if(!user){
            throw ApiError.BadRequest('Пользователь с таким username не найден');
        }

        const checkPwds = await bcrypt.compare(pwd, user.password);

        if(!checkPwds){
            throw ApiError.BadRequest('Исходный пароль не верен');
        }

        const hashPassword = await bcrypt.hash(pwd, 3);

        await db.query('INSERT INTO person (id, password) VALUES (?, ?)', [user.id, hashPassword]);

        return { message: 'Password changed successfully.'};
    }
}

module.exports = new UserService()