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
