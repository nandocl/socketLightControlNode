import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;

import * as serialPort from '../services/serialPort.js';

//Models
import User from '../models/user';
import Luz from '../models/luces';

////Users
export function login(req, res) {
    User.findOne({user: req.body.user})
        .then((user) => {
            if(user == null) return res.status(406).send({errMsg: 'loginErr'});
            let compare = bcrypt.compareSync(req.body.password, user.password);
            if(!compare) return res.status(406).send({msg: 'loginErr'});
            let token = jwt.sign({ user: user.user }, process.env.jwtKey);
            let loginUser = {id: user._id, name: user.name, user: user.user, email: user.email,
                             phone: user.phone, token: token};
            return res.status(200).send(loginUser);
        })
};

export function loginWithToken(req, res){
    jwt.verify(req.body.token, process.env.jwtKey, (err, decoded) => {
        if(err) return res.status(406).send({errMsg: 'tokErr'});
        User.findOne({user: decoded.user}).then(user => {
            if(user == null) return res.status(406).send({errMsg: 'tokErr'});
            return res.status(200).send({
                id: user._id,
                name: user.name, 
                user: user.user, 
                email: user.email,
                phone: user.phone,
            });
        });
    });
};

export function saveUser(req, res) {
    User.findOne({user: req.body.user}).then(async usr => {
        if(usr != null) return res.status(406).send({errMsg: 'usrExists'});
        const newPassword = bcrypt.hashSync(req.body.password, saltRounds);
        let newUserData = {
            name: req.body.name,
            user: req.body.user,
            password: newPassword,
            email: req.body.email,
            phone: req.body.phone
        }
        let newUser = new User(newUserData);
        newUser.save().then(() => {
            res.status(202).send({msg: 'usrCreated'});
        });
    });
};

//Menu
export async function getMenu(req, res){
    let menu = [];
    let l = await Luz.find({});
    if(l.length != 0) menu.push('luz');
    menu.push('settings');
    res.status(200).send(menu);
}

////Luces
export async function getAllLuz(req, res){
    let allDocs = await Luz.find({});
    res.status(200).send(allDocs);
}

//Crear item luz - {name: '', chipId: ''}
export function createLuz(req, res){
    let newLuz = new Luz(req.body);
    newLuz.save().then(() => {
        res.status(202).send({msg: 'luzCreated'});
    });
}

//Borrar item luz - {id: ''}
export function deleteLuz(req, res){
    Luz.findByIdAndDelete(req.body.id).then(luzItem => {
        res.status(604).send({msg: 'luzDeleted'});
    });
}

export function updateLuzStateNameSocket(newDataState){
    Luz.findById(mongoose.Types.ObjectId(newDataState.id)).then(luzItem => {
        if(luzItem.name != newDataState.name) luzItem.name = newDataState.name;
        if(luzItem.state != newDataState.state) {
            luzItem.state = newDataState.state;
            serialPort.serialPortWrite(newDataState.chipId.concat('.', newDataState.state, 'o'));
        }
        luzItem.save();
    });
}