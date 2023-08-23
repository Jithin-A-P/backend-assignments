import Role from './role.enum'

type JwtPayload = {
  id: string
  name: string
  email: string
  role: Role
}

export default JwtPayload
