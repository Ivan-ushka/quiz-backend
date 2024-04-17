const jwt = require('jsonwebtoken');
const db = require('../db/db')
class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error){
            return null;
        }
    }


    async saveToken(userId, refreshToken){
        let tokenData = await db.query(`SELECT * FROM token WHERE userID = $1;`, [userId])
        if(tokenData.rows.length !== 0){
            let token = await db.query(`UPDATE token SET refreshToken = $1 WHERE userId = $2`, [refreshToken, userId]);
            return token.rows[0];
        }
        let token  = await db.query(`INSERT INTO token (refreshToken, userID) VALUES ($1, $2)`, [refreshToken, userId]);
        return token.rows[0];
    }
 
    async removeToken(refreshToken){
        const tokenData = db.query(`DELETE FROM token where refreshToken = $1`, [refreshToken])
        return tokenData;
    }

    async findToken(refreshToken){
        const tokenData = await db.query(`SELECT * FROM token WHERE refreshToken = $1;`,[refreshToken]);
        return tokenData;
    }



}

module.exports = new TokenService();