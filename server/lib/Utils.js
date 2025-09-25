import jwt from 'jsonwebtoken'

export const genarateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET)
}