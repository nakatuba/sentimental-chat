FROM python:3.8
WORKDIR /backend

ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
COPY ./poetry.lock ./pyproject.toml ./
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev
