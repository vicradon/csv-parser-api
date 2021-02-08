# Osinachi Chukwujama Take Home Documentation
This is a web service which converts CSV to JSON and returns the required JSON fields. 
It comes with this documentation and unit tests using Jest and supertest.

## Routes
1. `POST /`

### `POST /`
#### Parameters
1. csv: required (JSON object)
    1. url: required (string)
    2. select_fields: optional (string[])

#### Example request body
  
  ```json
    {
      "csv":{
        "url": "https://linktocsv",
        "select_fields": ["First Name", "Last Name", "Age"],
      }
    }
  ```
  
#### Example response object
    
    ```json
    {
      "conversion_key": "ZEMAHBb54vkFXPHA9jHY6Xp3gMnMAKYg",
      "json": [
        {
          "First Name":"Ade",
          "Last Name":"Stark",
          "Age": 21 
        },
        {
          "First Name":"Ade",
          "Last Name":"Stark",
          "Age": 21 
        }
      ]
    }
    ```
    
## Running tests
To run tests, run this command
```bash
npm test
```
## Test suites covered
1. Testing the Post endpoint

### Testing the Post endpoint
1. Testing that it returns the correct status code
2. Testing that the returned JSON is of the required schema