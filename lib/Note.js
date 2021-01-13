class Note {
    constructor(id, title, creator,place) {
        this.id = id;
        this.title = title;
        this.creator = creator;
        this.last_editor = creator;
        this.place = place;
        this.settings = undefined;
        this.body = undefined;
        this.expanded_body = undefined;
    }
}
module.exports = Note