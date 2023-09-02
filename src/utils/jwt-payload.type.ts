import Role from './role.enum'

type JwtPayload = {
  name: string
  email: string
  role: Role
}

export default JwtPayload
