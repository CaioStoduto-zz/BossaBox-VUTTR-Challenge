const axios = require('axios')

module.exports = {
  GitHub: {
    authURL: (host) => {
      const url = new URL('https://github.com/login/oauth/authorize')
      const searchParams = url.searchParams

      searchParams.append('client_id', process.env.GITHUB_PUBLIC)
      searchParams.append('redirect_uri', `http://${host}/OAuth/GitHub`)

      url.search = searchParams.toString()

      return url.toString()
    },
    getLoginIdentifier: async (query) => {
      if (query.code) {
        const res = await axios.post('https://github.com/login/oauth/access_token', '', {
          params: {
            client_id: process.env.GITHUB_PUBLIC,
            client_secret: process.env.GITHUB_SECRET,
            code: query.code
          },
          headers: {
            Accept: 'application/json'
          }
        })

        if (res.data.error) {
          return { err: { code: 400, message: res.data.error_description } }
        }

        const res2 = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${res.data.access_token}`
          }
        }).catch((error) => {
          return { err: { code: error.response.status, message: error.response.data } }
        })

        return { identifier: res2.data.id }
      } else {
        return { err: { code: 400, message: 'Code parameter missing.' } }
      }
    }
  }
}
