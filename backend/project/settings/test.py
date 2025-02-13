from .base import *
import os
import dotenv

# Get the directory of this file (tests/conftest.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

dotenv.load_dotenv(os.path.join(BASE_DIR, "../.env/.env.dev"))
dotenv.load_dotenv(os.path.join(BASE_DIR, "../.env/.env.test"), override=True)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-a+z6y)eo2g*bd*@0&n17=ydam*h@j@0_iktd7c_76pr9b%96=-"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",  # Use SQLite for tests
        "NAME": ":memory:",  # Faster test execution using in-memory DB
    },
}
