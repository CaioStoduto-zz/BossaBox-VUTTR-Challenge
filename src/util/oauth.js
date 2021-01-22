//* Importing dependencies
const axios = require('axios')

//* Exporting all OAuth methods to able others modules to use it
module.exports = {
  GitHub: {
    /**
     * Creates the URL used to redirect the user to the OAuth
     * @param {String} host the host used from the request
     * @returns {String} the URL
     */
    authURL: (host) => {
      //* Sets the URL to turn it easier to add parameters
      const url = new URL('https://github.com/login/oauth/authorize')
      const searchParams = url.searchParams

      //* Adds the parameters to the url.searchParams object
      searchParams.append('client_id', process.env.GITHUB_PUBLIC)
      searchParams.append('redirect_uri', `http://${host}/OAuth/GitHub`)

      //* Sets the (String) url.searchParams to url.search to maintain consistency
      url.search = searchParams.toString()

      //* Returns the URL ready to be used
      return url.toString()
    },
    /**
     * Gets the user identifier using the OAuth response
     * @param {object} query
     * @returns {object} containing the identifier or the error that occured
     */
    getIdentifier: async (query) => {
      //* If the query (the request parameters) has the parameter code
      if (query.code) {
        const axiosConfig = {
          //* Sets the parameters required to request the access_token
          params: {
            client_id: process.env.GITHUB_PUBLIC,
            client_secret: process.env.GITHUB_SECRET,
            code: query.code
          },
          //* Header set to get the response in json
          headers: {
            Accept: 'application/json'
          }
        }

        //* Requests to the OAuth Service the access_token with the code provided by the OAuth redirect
        const res = await axios.post('https://github.com/login/oauth/access_token', '', axiosConfig)

        //* If occured any error, it will return the error
        if (res.data.error) {
          return { err: { code: 400, message: res.data.error_description } }
        }

        //* Requests to the OAuth Service the user identified with the access_code
        const res2 = await axios.get('https://api.github.com/user', {
          //* Sets the header required to request the ID
          headers: {
            Authorization: `token ${res.data.access_token}`
          }
        }).catch((error) => { //* In case that occurs any error, it will return the error
          return { err: { code: error.response.status, message: error.response.data } }
        })

        //* Returns the identifier that was given by the OAuth Service
        return { identifier: res2.data.id }
      } else { //* Occured an error, so it will return the error
        return { err: { code: 400, message: 'Code parameter missing.' } }
      }
    }
  }
}
