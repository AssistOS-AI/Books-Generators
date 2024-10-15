const llmModule = require("assistos").loadModule("llm", {});
const documentModule= require("assistos").loadModule("document", {});
export class BooksGeneratorModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.documentId = this.element.getAttribute("data-documentid")
        this.invalidate();

    }

    async beforeRender() {
    }

    async afterRender() {
    }

    async closeModal(_target) {
        await assistOS.UI.closeModal(_target);
    }

    async generateBook(_target) {
        const formElement=this.element.querySelector("form");
        const formData = await assistOS.UI.extractFormInformation(formElement);
        if (!formData.isValid) {
            return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
        }
        // only make the document type a book for now
        await documentModule.updateDocumentType(assistOS.space.id, this.documentId, "book");
        /* ... send the request to generate the book here ... */
        await this.closeModal(_target);
    }

}
