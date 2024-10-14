export class BooksGeneratorPage {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();

    }

    async beforeRender() {

    }

    async afterRender(){

    }

    async openGenerateBookModal(_target){
        await assistOS.UI.showModal("books-generator-modal",{
            "presenter": "books-generator-modal",
        });
    }

}
