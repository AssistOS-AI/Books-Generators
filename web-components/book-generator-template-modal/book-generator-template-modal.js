const documentModule = require("assistos").loadModule("document", {});
const booksModule = require("assistos").loadModule("books", {});

export class BooksGeneratorTemplateModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
    }

    async beforeRender() {
    }

    async afterRender() {
    }

    async closeModal(_target) {
        await assistOS.UI.closeModal(_target);
    }

    async generateBookTemplate(_target) {
        const formElement = this.element.querySelector("form");
        const formData = await assistOS.UI.extractFormInformation(formElement);
        if (!formData.isValid) {
            return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
        }
        const documentData = formData.data;
        await booksModule.generateTemplate(assistOS.space.id, documentData);
        /*
        const bookTitle = documentData.title;
        delete documentData.title;
        let docId = await documentModule.addDocument(assistOS.space.id, {
            title: `template_${bookTitle}`,
            abstract: JSON.stringify(documentData),
        });*/
        assistOS.UI.closeModal(_target);
        await assistOS.UI.changeToDynamicPage(`space-application-page`, `${assistOS.space.id}/Space/document-view-page/${docId}`);
    }

}
