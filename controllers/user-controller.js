const ApiError = require("../exseptions/api-error");
const userService = require("../service/user-service");
const {validationResult} = require('express-validator')

class UserController{
    async registration(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {name, pwd} = req.body;
            const userData  = await userService.registration(name, pwd);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData);
        } catch (error) {
            next(error);
        }
     
    }

    async login(req, res, next){
        try {
            const {name, pwd } = req.body;
            const userData  = await userService.login(name, pwd);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData);
        } catch (error) {
            next(error);
        }
     
    }

    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {
            next(error);
        }
     
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} =req.cookies;
            const userData  = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnle: true})
            return res.json(userData);
        } catch (error) {
            next(error);
        }
     
    }

    async checkPwd(req, res, next){
        try {
           
            const {email, password} = req.body;
            console.log({email, password})
            const isCheck = await userService.checkPwd(email, password)
            return res.json(isCheck)
        } catch (error) {
             next(error)
        }
    }

    async changePwd(req, res, next){
        try {
            const {email, password} = req.body;
            console.log({email, password})
            const userData = await userService.changePwd(email, password)
            return res.json(userData)
        } catch (error) {
             next(error)
        }
    }

    async getUser(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData  = await userService.getUser(refreshToken);
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }

    async update(req, res, next){
        try {
            const userData  = await userService.update(req.body);
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();