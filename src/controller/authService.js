const CryptoJS = require('crypto-js')

let paymentez_server_application_code = 'LINKTOPAY01-EC-SERVER';
let paymentez_server_app_key = 'G8vwvaASAZHQgoVuF2eKZyZF5hJmvx';
let unix_timestamp = String(Math.floor(new Date().getTime() / 1000));
// unix_timestamp = String("1546543146"); 
console.log("UNIX TIMESTAMP:", unix_timestamp);
let uniq_token_string = paymentez_server_app_key + unix_timestamp;
console.log('UNIQ STRING:', uniq_token_string);
let uniq_token_hash = CryptoJS.SHA256(uniq_token_string);
console.log('UNIQ STRING:', uniq_token_hash);
let string_auth_token = btoa(paymentez_server_application_code + ";" + unix_timestamp + ";" + uniq_token_hash);
console.log('AUTH TOKEN:', string_auth_token);

module.exports = { string_auth_token }