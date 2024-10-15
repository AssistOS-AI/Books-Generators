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
    async openGenerateBookTemplateModal(_target){
        await assistOS.UI.showModal("book-generator-template-modal",{
            "presenter": "book-generator-template-modal",
        });
    }
}
