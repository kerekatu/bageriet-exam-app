import CONSTANTS from '@/lib/constants'

const checkUserRole = (roles, userRole) => {
  if (userRole === 'ADMIN') return true
  if (roles.includes(userRole)) return true

  return false
}

const withAuth = ({ options, callback }) => {
  return async (context) => {
    let data = null
    const defaultOptions = options || { isProtected: false, roles: [] }
    const { req, res } = context

    if (callback) {
      const response = await callback(context)
      data = await JSON.parse(JSON.stringify(response))
    }

    const statusResponse = await fetch(`http://localhost:5033/login/loggedin`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    const isLoggedIn = await statusResponse.json()

    if (isLoggedIn?.user) {
      const userResponse = await fetch(
        `http://localhost:5033/bruger/admin/${isLoggedIn.user}`
      )
      const user = await userResponse.json()
      delete user.password

      if (defaultOptions.isProtected && defaultOptions.roles.length) {
        const isAuth = checkUserRole(
          defaultOptions.roles || CONSTANTS.userRoles,
          user?.rolle
        )

        if (!isAuth) return { redirect: { permanent: false, destination: '/' } }
      }

      return {
        props: {
          user,
          data,
        },
      }
    } else if (!isLoggedIn && defaultOptions.isProtected) {
      return { redirect: { permanent: false, destination: '/' } }
    } else {
      return { props: { user: false, data } }
    }
  }
}

export default withAuth
