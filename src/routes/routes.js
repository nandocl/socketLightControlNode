import express from 'express';
let router = express.Router();

//Controllers
import * as mainCrtl from '../controllers/main.controller';

//Usuarios
router.post('/login', mainCrtl.login);
router.post('/loginWithToken', mainCrtl.loginWithToken);
router.post('/singup', mainCrtl.saveUser);

//Main Menu
router.get('/getMenu', mainCrtl.getMenu);

//Luz
router.get('/getAllLuz', mainCrtl.getAllLuz);
router.post('/createLuz', mainCrtl.createLuz);
router.post('/deleteLuz', mainCrtl.deleteLuz);

export default router;