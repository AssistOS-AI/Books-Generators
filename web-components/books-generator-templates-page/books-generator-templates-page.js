export class BooksGeneratorTemplatesPage {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
        //loading templates from the database here

    }
    async beforeRender(){
        this.dummyText="This is templates page";
    }
    async afterRender(){

    }
}
