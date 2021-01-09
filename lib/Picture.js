class Picture {
    constructor(id,creator,type,place,image_data) {
        this.id = id;
        this.title = undefined;
        this.creator = creator;
        this.last_editor = creator;

        this.type = type;
        this.place = place;
        this.image_data = image_data;

        this.settings = undefined;
    }
}