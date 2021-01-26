class Canvas {
    constructor(id ,title, owner) {
        this.id = id;
        this.title = title;
        this.owner = owner;
        this.settings = undefined;
        this.default_perm = undefined;
        this.notes = undefined;
        this.connections = undefined;
        this.pictures = undefined;
    }
}

module.exports = Canvas