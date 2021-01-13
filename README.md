# awesome-node-mail-auth
Don't spend your time to mail-auth logic. Just focus on YOUR logic.

## Key Controllers
* API Index: `/api/auth`
- `/email-send` (POST) - This also check userID exists.
- `/email-auth` (GET)
- `/email-check` (POST)

## Start
1. Define your configuration to `.env`
2. Insert controllers, api to your project
3. Define your frontend with three URI

## Auth Logic
1. POST to `/email-send`
   - params: `email_address` (req.body)
   - returns:
     - SUCCESS - `{ success: true, uuid }`
     - EXIST(FAIL) - `{ success: false, message: "ID Exist" }`
     - SEND(FAIL) - `{ mail: "fail" }` -> status 400
2. GET from `/email-auth`
   - params: `uuid` (req.query, ex. `/email-auth?uuid=XXX)
   - returns:
     - SUCCESS: Success Alert Script
     - FAIL: Fail Alert Script
3. POST to `/email-check`
   - params: `uuid`, `email_address` (req.body)
   - returns:
     - SUCCESS: `{ authed: true }`
     - FAIL: `{ authed: false }` -> status 409

## Dependencies
- dotenv
- nodemailer
- moment