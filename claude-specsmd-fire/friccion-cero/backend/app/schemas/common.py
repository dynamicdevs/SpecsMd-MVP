"""Base de schemas con alias camelCase para el contrato con el frontend Angular."""
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Serializa/deserializa usando camelCase, aceptando también snake_case."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
