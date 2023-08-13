import os
from fastapi import FastAPI
from fastapi_sqlalchemy import DBSessionMiddleware, db
from schema import Cancion as SchemaCancion
from models import Cancion as ModelCancion
from dotenv import load_dotenv

load_dotenv('.env')

app = FastAPI()

app.add_middleware(DBSessionMiddleware, db_url=os.environ['DATABASE_URL'])


@app.get("/")
async def root():
    return {"message": "API para el primer parcial"}


@app.post('/cancion/', response_model=SchemaCancion)
async def post_cancion(cancion: SchemaCancion):
    db_cancion = ModelCancion(nombre=cancion.nombre, descripcion=cancion.descripcion,
                              artista=cancion.artista, duracion=cancion.duracion,
                              extension=cancion.extension, album=cancion.album, anio=cancion.anio)
    db.session.add(db_cancion)
    db.session.commit()
    return db_cancion


@app.get('/cancion/')
async def get_cancion():
    cancion = db.session.query(ModelCancion).all()
    return cancion


@app.get('/cancion/{nombre}')
async def get_cancion_nombre(nombre: str):
    cancion = db.session.query(ModelCancion).filter(
        ModelCancion.nombre == nombre).first()
    return cancion


@app.put('/cancion/{id}', response_model=SchemaCancion)
async def update_cancion(id: int, cancion: SchemaCancion):
    db_cancion = db.session.query(ModelCancion).filter(
        ModelCancion.id == id).first()
    for attr, value in cancion.dict().items():
        setattr(db_cancion, attr, value)
    db.session.commit()
    return db_cancion


@app.delete('/cancion/{id}')
async def delete_cancion(id: int):
    cancion = db.session.query(ModelCancion).filter(
        ModelCancion.id == id).first()
    db.session.delete(cancion)
    db.session.commit()
    return {"message": "Canción eliminada exitosamente"}
