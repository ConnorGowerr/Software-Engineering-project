const dbClient = require('./db.js')

const nodemailer = require('nodemailer');

class UserController {
    constructor() {
       
    }

    returnUser(query, callback) {
        dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
            if (err) {
                console.error("Error setting search path:", err);
                return callback([]);  
            }
    
            const queryString = `SELECT * FROM Users WHERE LOWER(username) = LOWER($1)`;
            dbClient.query(queryString, [query], (err, res) => {
                if (err) {
                    console.error("Database query error:", err);
                    return callback([]);
                }

                callback(res.rows);  
            });
        });
    }

    updateGroupStatus = async (req, res) => {
        const groupId = req.params.id;
        const { isPublic } = req.body;
    
        if (typeof isPublic !== 'boolean') {
            return res.status(400).json({ error: 'isPublic must be a boolean' });
        }
    
        try {
            const result = await dbClient.query(
                'UPDATE "Hellth"."usergroups" SET isPublic = $1 WHERE groupid = $2 RETURNING *',
                [isPublic, groupId]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Group not found' });
            }
    
            res.json({ success: true, updatedGroup: result.rows[0] });
        } catch (err) {
            console.error('Error updating group status:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


    sendInvite = async (req, res) => {
        const { username } = req.body;
        const { groupId } = req.params;
    
        if (!username || !groupId) {
            return res.status(400).json({ error: 'Username and groupId are required.' });
        }
    
        try {
            
            const result = await dbClient.query(
                'SELECT email FROM "Hellth"."users" WHERE username = $1',
                [username]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const email = result.rows[0].email;


            const memberCheck = await dbClient.query(
                'SELECT 1 FROM "Hellth"."groupmembers" WHERE username = $1 AND groupid = $2',
                [username, groupId]
            );
    
            if (memberCheck.rowCount > 0) {
                return res.status(409).json({ error: 'User is already a member of this group' });
            }
            console.log(email)
    
         
            const inviteLink = `http://localhost:8008/api/groups/confirm/${groupId}?username=${encodeURIComponent(username)}`;
    
           
            const html = `
                <p>Hello ${username},</p>
                <p>You’ve been invited to join a group on Hellth.</p>
                <p><a href="${inviteLink}"><button>Join Group</button></a></p>
            `;
    
           
            await this.sendEmail({
                to: email,
                subject: 'You’ve Been Invited to Join a Group',
                html
            });


    
            res.json({ success: true, message: 'Invitation sent.' });
        } catch (err) {
            console.error('Error sending invite:', err);
            res.status(500).json({ error: 'Failed to send invitation' });
        }
    };

    confirmInvite = async (req, res) => {
        const { groupId } = req.params;
        const { username } = req.query;
        const isadmin = false;
    
        if (!username) {
            return res.status(400).send('Missing username in confirmation link.');
        }
    
        try {
            await dbClient.query(
                'INSERT INTO "Hellth"."groupmembers" (groupid, username, isadmin) VALUES ($1, $2, $3)',
                [groupId, username, isadmin]
            );
    
            res.send('<h2>You have successfully joined the group!</h2>');
        } catch (err) {
            console.error('Error confirming invite:', err);
            res.status(500).send('Failed to confirm invitation.');
        }
    };


    sendEmail = async ({ to, subject, html }) => {
    
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'eleazar.bins60@ethereal.email',
                pass: 'j3WGEuWVpbBt5drs8J'
            }
        });
    
        const info = await transporter.sendMail({
            from: '"Health App 👨‍⚕️" <no-reply@hellth.dev>',
            to,  
            subject,
            html
        });
    
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    };


    confirmAdmin = async (req, res) => {
        const { username, groupId } = req.body;
    
        if (!username || !groupId) {
            return res.status(400).json({ error: 'Username and groupId are required.' });
        }
    
        try {
            const result = await dbClient.query(
                'UPDATE "Hellth"."groupmembers" SET isadmin = true WHERE groupid = $1 AND username = $2 RETURNING *',
                [groupId, username]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Group or user not found' });
            }
    
            res.json({ success: true, updatedGroup: result.rows[0] });
        } catch (err) {
            console.error('Error updating group status:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


    removeUserFromGroup = async (req, res) => {
        const { username, groupId } = req.body;
    
        if (!username || !groupId) {
            return res.status(400).json({ error: 'Username and groupId are required.' });
        }
    
        try {
            const result = await dbClient.query(
                'DELETE FROM "Hellth"."groupmembers" WHERE groupid = $1 AND username = $2 RETURNING *',
                [groupId, username]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Group or user not found' });
            }
    
            res.json({ success: true, updatedGroup: result.rows[0] });
        } catch (err) {
            console.error('Error updating group status:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    
    

    // addGroups(query, callback) {
    //     dbClient.query('SET SEARCH_PATH TO "Hellth", public;', (err) => {
    //         if (err) {
    //             console.error("Error setting search path:", err);
    //             return callback([]);  
    //         }
    
           
    //     });
    // }


}

module.exports = UserController;



