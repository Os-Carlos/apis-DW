const db = require('../models');
const Cliente = db.clientes;
const Op = db.Sequelize.Op;

//crear y guardar cliente
exports.create = (req, res) => {
    if (!req.body.nombre) {
        res.status(404).send({
            message: 'el contenido del nombre no puede estar vacio'
        });
        return;
    }

    const cliente = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        correo: req.body.correo,
        telefono: req.body.telefono,
        ingreso: req.body.ingreso,
        status: req.body.status ? req.body.status : false
    }

    Cliente.create(cliente)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al crear el cliente en la bd'
            });
        });
};


//consultar los clientes por nombre o todos
exports.findAll = (req, res) => {
    const nombre = req.body.nombre;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Cliente.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'error al obtener el cliente'
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Cliente.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `no se encuentra el cliente con id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener el cliente con id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Cliente.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'cliente actualizado correctamente'
                });
            } else {
                res.send({
                    message: `'no se puede actualizar el cliente con el id: ${id}, o no existe'`
                });
            };
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el cliente con id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Cliente.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'cliente eliminado correctamente'
                });
            } else {
                res.send({
                    message: `'el cliente con el id: ${id} no existe'`
                });
            };
        })
        .catch(err => {
            res.status(500).send({
                message: "Cono se pudo eliminar el cliente con id=" + id
            });
        });
};