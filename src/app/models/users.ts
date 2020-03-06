export class User {

    constructor(_id='', name='', username='', password='', mail='') {

        this._id = _id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.mail = mail;
    
    }
    
    _id: string;
    name: string;
    username: string;
    password: string;
    mail: string;
}
