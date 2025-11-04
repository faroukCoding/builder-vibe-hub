import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const handleChatbaseToken: RequestHandler = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const SECRET = process.env.CHATBOT_IDENTITY_SECRET;
  if (!SECRET) {
    return res.status(500).json({ error: "CHATBOT_IDENTITY_SECRET not set" });
  }

  const { id, name, email } = req.body ?? {};
  if (!id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  const payload = { sub: id, name: name ?? null, email: email ?? null };

  try {
    const token = jwt.sign(payload, SECRET, { algorithm: "HS256", expiresIn: "1h" });
    return res.status(200).json({ token });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to sign chatbase token:", err);
    return res.status(500).json({ error: "Token generation failed" });
  }
};
