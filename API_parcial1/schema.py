# build a schema using pydantic
from pydantic import BaseModel


class Cancion(BaseModel):
    nombre: str
    descripcion: str
    artista: str
    duracion: int
    extension: str
    album: str
    anio: str

    class Config:
        orm_mode = True
