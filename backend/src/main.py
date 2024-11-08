from json import dumps

from telethon import TelegramClient

from settings import Settings

settings = Settings()

api_id = int(settings.api_id.get_secret_value())
api_hash = settings.api_hash.get_secret_value()
client = TelegramClient("../sessions/anon.session", api_id, api_hash)


async def handle_getting_dialogues():
    pass


async def main():
    # print((await client.get_me()).stringify())
    print(dumps(await client.get_dialogs()))


with client:
    client.loop.run_until_complete(main())
