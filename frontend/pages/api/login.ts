import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

// TODO: エラーハンドリング
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await fetch('http://backend:8000/api/auth/jwt/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  }).then(res => res.json())
  setCookie({ res }, 'accessToken', token.access, {
    httpOnly: true,
    path: '/',
  })
  res.status(200).json({ token })
}
