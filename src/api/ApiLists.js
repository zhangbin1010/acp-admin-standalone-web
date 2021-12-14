import oauth from './oauth/OauthApi'
import runtime from './sysConfig/runtimeConfig'
import app from './sysConfig/appConfig'
import auth from './sysConfig/authConfig'
import org from './sysConfig/orgConfig'
import user from './sysConfig/userConfig'
import role from './sysConfig/roleConfig'

export default {
  auth: Object.assign(oauth, auth),
  runtime: runtime,
  app: app,
  org: org,
  user: user,
  role: role
}
