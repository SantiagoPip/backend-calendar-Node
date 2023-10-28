const {response} = require('express');
const Evento = require('../models/Evento');

const getEventos= async(req,res=response)=>{
    const eventos = await Evento.find()
                               

    res.json({
        ok:true,
        eventos
    })
}
const crearEventos=async(req,res=response)=>{
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save()
        res.json({
            ok:true,
            msg:eventoGuardado
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
   
}

const actualizarEvento=async(req,res=response)=>{
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        console.log(evento,'EVENTO')

        if(!evento){
            res.status(404).json({
                ok:false,
                msg:'Evento no existe con ese Id'
            })
        }        
        console.log(uid,'UID')
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegios para editar este evento'
            })
        }
        const nuevoEvento = {
            ...req.body,
            user:uid
        }
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true})
        res.json({
            ok:true,
            evento:eventoActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}
const eliminarEvento=async (req,res=response)=>{
    const eventoId = req.params.id;
    const uid = req.uid;
    const evento = await Evento.findById(eventoId);
    console.log(evento,'EVENTOOOOO')
    if(!evento){
        return res.status(404).json({
            ok:false,
            msg:'Evento no existe con ese Id'
        })
    }        
    if(evento.user.toString() !== uid){
        return res.status(401).json({
            ok:false,
            msg:'No tiene privilegios para editar este evento'
        })
    }
    try {
        await Evento.findByIdAndDelete(eventoId);
        res.json({ok:true})
    }catch(error){
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
        }
    
}

module.exports = {
    getEventos,
    actualizarEvento,
    eliminarEvento,
    crearEventos
}