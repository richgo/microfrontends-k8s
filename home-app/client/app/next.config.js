require('dotenv').config()

const ACCOUNTS_URL = process.env.NEXT_PUBLIC_ACCOUNTS_URL
const PRODUCTS_URL = process.env.NEXT_PUBLIC_PRODUCTS_URL
//const { PORT } = process.env

module.exports = {
  rewrites() {
    return [
      {
        source: "/account",
        destination: ACCOUNTS_URL + '/account',
      },
      {
        source: '/account/:path*',
        destination: ACCOUNTS_URL + '/account/:path*',
      },
      {
        source: '/products',
        destination: PRODUCTS_URL + '/products',
      },
      {
        source: '/products/:path*',
        destination: PRODUCTS_URL + '/products/:path*',
      },
    ]
  },
  webpack: (config, { isServer }) => {
    console.log("find products on the zone app at: " + PRODUCTS_URL) 
    console.log("find accounts on the zone app at: " + ACCOUNTS_URL)
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }
    return config
  }
}