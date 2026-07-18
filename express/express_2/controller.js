export const paramsValue = (req, res) => {
    const pramsValue = req.params.username
    res.send(`Welcome to Users Page (${pramsValue})`)
}

export const queryValue = (req, res) => {
    const queryValue = req.query.keyword
    const queryTopic = req.query.topic
    res.send(`Welcome to Users Page (${queryValue}) and Topic is ${queryTopic}`)
} 

export const home = (req, res) => {
    res.send(`Welcome to home Page`)
}