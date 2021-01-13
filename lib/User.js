class User {
    constructor(id ,username) {
        this.id = id;
        this.username = username;
        this.settings = undefined;
        this.notes = undefined;
        this.connections = undefined;
        this.pictures = undefined;
        this.default_note_settings = undefined;
    }
}

module.exports = User