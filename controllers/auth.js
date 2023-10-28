const {response} = require('express')
const {validationResult} = require('express-validator')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')
const crearUsuario = async (req,res = response)=>{
    const{email,password} = req.body;
    //Errores
    try{
        let usuario = await Usuario.findOne({email})
        console.log(usuario)
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'Un usuario existe con ese correo'
            })
        }
        usuario = new Usuario(req.body)

        // const usuario = new Usuario(req.body)
        //Encriptar contrasena
        const salt = bcrypt.genSaltSync(10)
        usuario.password = bcrypt.hashSync(password,salt);
        await usuario.save()
        const token = await generarJWT(usuario.id,usuario.name)
        //Generar JWT
        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Consulte con el administrador'
        })
    }
}

const loginUsuario = async (req,res = response)=>{
    const{email,password} = req.body;
  //  const errors = validationResult(req);
    try{
        const usuario = await Usuario.findOne({email})
        console.log(usuario || false)
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario no existe  ese email'
            })
        }
        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password,usuario.password)
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            })
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id,usuario.name)
        console.log(token,'token')
        res.json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })
    }catch(error){
       res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         ok:false,
    //         errors:errors.mapped()
    //     })
    // }
    // res.json({
    //     ok:true,
    //     msg:'login',
    //     email,
    //     password
    // })
}

const revalidarToken = async(req,res = response)=>{
    const {uid,name} = req
    
    const token = await generarJWT(uid,name,)
    res.json({
        ok:true,
        uid:uid,
        name,
        token
    })
}

module.exports = {crearUsuario,loginUsuario,revalidarToken}