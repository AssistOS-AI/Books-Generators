const applicationModule = require('assistos').loadModule('application', {});

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
        await assistOS.loadifyFunction(async () => {
                const formElement = this.element.querySelector("form");
                const formData = await assistOS.UI.extractFormInformation(formElement);
                if (!formData.isValid) {
                    return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
                }
                const documentData = formData.data;
                const documentId = (await applicationModule.runApplicationFlow(assistOS.space.id, "BooksGenerator", "GenerateTemplate", documentData)).data;
                assistOS.UI.closeModal(_target);
                await assistOS.UI.changeToDynamicPage(`space-application-page`, `${assistOS.space.id}/Space/document-view-page/${documentId}`);
            }
        )
    }
    async PreviewBookTemplateModal(_target) {
        await assistOS.UI.showModal("book-generator-template-preview", {
            "presenter": "book-generator-template-preview",
        });
    }
}
