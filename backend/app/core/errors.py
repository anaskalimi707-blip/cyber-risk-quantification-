from typing import List, Optional, Any, Dict
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    code: str
    message: Optional[str] = None


class ProblemDetail(BaseModel):
    type: str = "https://api.cyberoptix.example/errors/general"
    title: str
    status: int
    detail: str
    instance: Optional[str] = None
    request_id: Optional[str] = None
    errors: List[ErrorDetail] = []


class CyberOptixException(Exception):
    def __init__(
        self,
        status_code: int,
        title: str,
        detail: str,
        type_url: str = "https://api.cyberoptix.example/errors/business",
        errors: Optional[List[ErrorDetail]] = None
    ):
        self.status_code = status_code
        self.title = title
        self.detail = detail
        self.type_url = type_url
        self.errors = errors or []
        super().__init__(detail)


async def cyberoptix_exception_handler(request: Request, exc: CyberOptixException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req_unknown")
    payload = ProblemDetail(
        type=exc.type_url,
        title=exc.title,
        status=exc.status_code,
        detail=exc.detail,
        instance=str(request.url.path),
        request_id=request_id,
        errors=exc.errors
    )
    return JSONResponse(status_code=exc.status_code, content=payload.model_dump(exclude_none=True))


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req_unknown")
    errors = []
    for err in exc.errors():
        field = ".".join(str(loc) for loc in err.get("loc", []))
        errors.append(
            ErrorDetail(
                field=field,
                code=err.get("type", "invalid_value"),
                message=err.get("msg", "Validation error")
            )
        )
    
    payload = ProblemDetail(
        type="https://api.cyberoptix.example/errors/validation",
        title="Validation Error",
        status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="The request entity contains invalid parameters or formats.",
        instance=str(request.url.path),
        request_id=request_id,
        errors=errors
    )
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=payload.model_dump(exclude_none=True))


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "req_unknown")
    payload = ProblemDetail(
        type="https://api.cyberoptix.example/errors/internal",
        title="Internal Server Error",
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="An unexpected error occurred while processing your request.",
        instance=str(request.url.path),
        request_id=request_id,
        errors=[ErrorDetail(code="internal_error", message=str(exc))]
    )
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=payload.model_dump(exclude_none=True))
