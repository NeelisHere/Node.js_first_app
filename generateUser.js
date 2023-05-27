const generator = require('generate-password');
const { generateUsername } = require("unique-username-generator")
// const getEmail = require("get-email-address-from-npm-username")

const generateUser = () => {
    const username = generateUsername()
    // const email = getEmail(username)
    const password = generator.generate({
        length: 14,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        excludeSimilarCharacters: true
    })
    // return {username, email, password}
    return { username, password }
}

// const user = generateUser()
// console.log(user)

module.exports = generateUser