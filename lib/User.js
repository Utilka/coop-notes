class User {
    constructor(id ,nick) {
        this.id = id;
        this.nick = nick;
        this.settings = undefined;
        this.default_note_settings = undefined;
    }
}

module.exports = User