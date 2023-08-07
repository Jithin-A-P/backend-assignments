import HttpStatusMessages from "../utils/http-status-messages"
import HttpException from "./http.exception"

class NotFoundException extends HttpException {
  constructor() {
    super(404, HttpStatusMessages['CODE_404'])
  }
}

export default NotFoundException
