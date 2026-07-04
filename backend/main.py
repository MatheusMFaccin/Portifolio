"""
Backend FastAPI para o portfólio.

Endpoints:
  POST /api/contact  — envia e-mail via Resend (requer Bearer token)

Uso:
  cd backend/
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

# ─── Config ────────────────────────────────────────────────────────────────────
API_TOKEN = os.getenv("API_TOKEN", "")
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")

if not API_TOKEN:
    raise RuntimeError("API_TOKEN não configurado no .env")
if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY não configurado no .env")

# ─── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="Portfolio API", version="1.0.0")

# CORS — origens permitidas (dev + produção via nginx)
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Authorization", "Content-Type"],
)


# ─── Auth ───────────────────────────────────────────────────────────────────────
async def verify_token(authorization: str = Header(...)) -> str:
    """Verifica o Bearer token estático."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de autorização inválido")
    token = authorization.split(" ", 1)[1]
    if token != API_TOKEN:
        raise HTTPException(status_code=401, detail="Token inválido")
    return token


# ─── Schemas ────────────────────────────────────────────────────────────────────
class ContactMessage(BaseModel):
    name: str
    email: str
    message: str


# ─── Endpoints ──────────────────────────────────────────────────────────────────
@app.post("/api/contact")
async def send_contact(msg: ContactMessage, _token: str = Depends(verify_token)):
    """Recebe a mensagem do formulário de contato e encaminha via Resend."""
    if not msg.name.strip() or not msg.email.strip() or not msg.message.strip():
        raise HTTPException(status_code=400, detail="Todos os campos são obrigatórios")

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": "Portfolio <onboarding@resend.dev>",
                "to": ["faccinmatheus@gmail.com"],
                "subject": f"Novo contato do portfólio — {msg.name}",
                "html": (
                    f"<h2>Nova mensagem do portfólio</h2>"
                    f"<p><strong>Nome:</strong> {msg.name}</p>"
                    f"<p><strong>Email:</strong> {msg.email}</p>"
                    f"<p><strong>Mensagem:</strong></p>"
                    f"<blockquote style='padding:12px;background:#f5f5f5;border-left:4px solid #06b6d4;'>{msg.message}</blockquote>"
                ),
            },
        )

        if resp.status_code >= 400:
            detail = resp.text[:500]
            raise HTTPException(status_code=502, detail=f"Resend retornou erro: {detail}")

    return {"status": "ok", "message": "Mensagem enviada com sucesso!"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}
