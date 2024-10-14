export class BooksGeneratorTemplatesPage {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
        //loading templates from the database here

    }

    async beforeRender() {
        this.dummyText = "This is templates page";
    }

    async afterRender() {

    }

    async openCreateTemplateModal(_target) {
        debugger
        const templateData = await assistOS.UI.showModal("books-generator-create-template-modal", {
            presenter: "books-generator-create-template-modal"
        }, true);
    }
}
