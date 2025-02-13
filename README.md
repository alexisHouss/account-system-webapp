# Account System

Welcome to the Account System Backend! This repository contains the backend for a full-stack account management system. Currently, only the backend is available—with the frontend coming soon.

## Overview

This project is built with Django and is designed to demonstrate:
- **Dockerization:** Run the backend easily with Docker.
- **Database Integration:** A robust account system backed by a PostgreSQL database (with SQLite for testing).
- **Testing:** Comprehensive unit tests using Pytest.
- **Modern Dependency Management:** Managed with Poetry.

The backend features user account management, user profiles, and follow relationships between accounts.

## Technologies Used

- **Django:** The primary web framework.
- **Django REST Framework:** For building a RESTful API.
- **PostgreSQL / SQLite:** For database storage (PostgreSQL in production; SQLite for testing).
- **Docker & Docker Compose:** For containerization and deployment.
- **Poetry:** For dependency management.
- **Pytest:** For unit testing.

## Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/downloads/)
- [Docker & Docker Compose](https://docs.docker.com/compose/install/)
- [Poetry](https://python-poetry.org/docs/#installation)

### Running the Project Outside of Docker

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/account-system-backend.git
   cd account-system-backend
   ```

2. **Install dependencies with Poetry (including development dependencies):**

   ```bash
   poetry install --with dev
   ```

3. **Environment variables:**

    Environment variables have been pushed in the repo for ease of use.


4. **Activate virtual environment:**

   ```bash
   source .venv/bin/activate
   ```

5. **Run the tests:**

   ```bash
   pytest
   ```

### Running the Project with Docker

   ```bash
   docker compose up --build
   ```

## Future Plans

- Frontend: A frontend application (React/Vue/Angular) will be added shortly.
- Additional Features: Enhanced user management, social features, and more.



## License

This project is licensed under the MIT License.


