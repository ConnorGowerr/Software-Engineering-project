/* 
If you want to use hashing in a browser, do not use it from this file, this file is mostly usseless and could potentially be deleted
but for now I'm keeping it just incase something on backend wants to be hashed.


If you want to add hashing to your browser page then you need to do the following:

1. add <script src="https://cdn.jsdelivr.net/npm/bcryptjs/umd/index.js"></script> to your html file
2. add 
const hashedPassword = bcrypt.hashSync(userPassword, 10);
console.log(hashedPassword);

to the js file you want to do the hashing in, replacing userPassword with the variable you want to hash

3. ensure when adding your js file to broswer its in the format
<script type = "module" src="signUpDB.js"></script>
replace signupDB with name of js file

4. add 
<script type="module">
        import { createAccount } from "/signupDB.js";
        document.addEventListener("DOMContentLoaded", function() {
            const signUpButton = document.getElementById('signUpBtn');
            signUpButton.addEventListener('click', function(event) 
            {
                event.preventDefault();
                createAccount();
            });
        });
    </script>

to your html file just underneath the line in step 3

5. Profit
*/



import bcrypt from "bcryptjs";

// source: https://www.npmjs.com/package/bcryptjs

// Hashes a plain text string, returns the hash
export async function hash(string) 
{
    //Salt adds randomness to hashes so that the same string does not always generate the exact same hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(string, salt);

    return hash;

}
// Compares plain text to a hash to check if they match, returns true if match and false otherwise
export async function checkHash(string, hash) {
    try 
    {
        return await bcrypt.compare(string, hash);
    } catch (err) 
    {
        console.error(err.message);
        return false;
    }
}
