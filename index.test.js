const request = require('supertest')
const app = require('./index')
console.log(app)

describe('Post Endpoints', () => {
  it('shoudld return "First name" only', async () => {
    const res = await request(app)
      .post('/')
      .send({
        "csv": {
          "url": "https://AntiqueImpeccableActivecontent.vicradon.repl.co",
          "select_fields": ["First name", "Last name"]
        }
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('json')
  })

  it('shoudld return 400 when csv is not passed', async () => {
    const res = await request(app)
      .post('/')
      .send({})
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
  })

  it('shoudld return 400 when url is not passed', async () => {
    const res = await request(app)
      .post('/')
      .send({ csv: {} })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
  })

  it('shoudld return 200 when csv is valid', async () => {
    const res = await request(app)
      .post('/')
      .send({
        "csv": {
          "url": "https://valid-csv.vicradon.repl.co",
          "select_fields": ["First name", "Last name"]
        }
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('json')
    expect(res.body).toHaveProperty('conversion_key')
  })
})