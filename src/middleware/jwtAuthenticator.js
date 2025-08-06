import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js"; 

export const verifyToken = async(req, res, next)=>{
    const authHeader = req.headers.authorization; 
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1].trim();
    const decoded = jwt.verify(token, jwtSecretKey); 
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token'});
  }
} 
