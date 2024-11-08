from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_id: SecretStr
    api_hash: SecretStr

    model_config = SettingsConfigDict(env_file='../.env', env_file_encoding='utf-8')
