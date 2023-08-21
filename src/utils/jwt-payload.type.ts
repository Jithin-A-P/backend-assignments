import Role from './role.enum'

type JwtPayload = {
  id: number
  name: string
  email: string
  role: Role
}

export default JwtPayload
