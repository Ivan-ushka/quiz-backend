const jwt = require('jsonwebtoken');
const db = require('../db/db')
class TokenService{
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const [tokenData] = await db.query('SELECT * FROM token WHERE userId = ?', [userId]);
        if (tokenData.length !== 0) {
            await db.query('UPDATE token SET refreshToken = ? WHERE userId = ?', [refreshToken, userId]);
            return tokenData[0];
        }
        const [token] = await db.query('INSERT INTO token (refreshToken, userId) VALUES (?, ?)', [refreshToken, userId]);
        return token[0];
    }

    async removeToken(refreshToken) {
        await db.query('DELETE FROM token WHERE refreshToken = ?', [refreshToken]);
        return true;
    }

    async findToken(refreshToken) {
        const [tokenData] = await db.query('SELECT * FROM token WHERE refreshToken = ?', [refreshToken]);
        return tokenData;
    }



}

module.exports = new TokenService();